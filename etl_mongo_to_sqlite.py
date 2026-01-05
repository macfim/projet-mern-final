"""
Script ETL(Extract, Transform, Load) : Extraction de données MongoDB vers un entrepôt SQLite
Extrait les données de MongoDB et les charge dans un entrepôt SQLite suivant un schéma en étoile.
"""

from pymongo import MongoClient
import sqlite3
from datetime import datetime, date
from dateutil import parser

# Configuration
MONGO_URI = "mongodb://mernfinal_user:mernfinal_password@localhost:27017/simple_mern_blog?authSource=admin"
DB_NAME = "simple_mern_blog"
SQLITE_PATH = "dw_blog.sqlite"


def get_date_id(cursor, date_value):
    """
    Convertit une date et retourne son date_id
    
    TRANSFORMATION - Gestion des valeurs manquantes:
    Si date manquante/invalide -> utilise date du jour (fallback)
    """
    # TRANSFORMATION: Gestion valeurs manquantes - fallback vers date du jour
    if date_value is None:
        date_string = date.today().isoformat()
    elif isinstance(date_value, datetime):
        date_string = date_value.date().isoformat()
    else:
        try:
            parsed_date = parser.parse(str(date_value))
            date_string = parsed_date.date().isoformat()
        except:
            date_string = date.today().isoformat()  # Fallback si parsing échoue
    
    # TRANSFORMATION: Normalisation - extraction year, month, day
    year, month, day = map(int, date_string.split("-"))
    cursor.execute(
        "INSERT INTO DimDate(date, year, month, day) VALUES (?, ?, ?, ?)", 
        (date_string, year, month, day)
    )
    cursor.execute("SELECT date_id FROM DimDate WHERE date = ?", (date_string,))
    result = cursor.fetchone()
    return result[0]


def get_user_key(cursor, user_doc):
    """Ajoute un utilisateur et retourne son user_key"""
    mongo_id = str(user_doc["_id"])
    username = user_doc.get("username")
    email = user_doc.get("email")
    role = user_doc.get("role")
    
    cursor.execute(
      "INSERT INTO DimUser(mongo_user_id, username, email, role) VALUES (?, ?, ?, ?)", 
      (mongo_id, username, email, role)
    )
    cursor.execute("SELECT user_key FROM DimUser WHERE mongo_user_id = ?", (mongo_id,))
    result = cursor.fetchone()
    return result[0]


def get_post_key(cursor, post_doc):
    """Ajoute un post et retourne son post_key"""
    mongo_id = str(post_doc["_id"])
    title = post_doc.get("title")
    
    cursor.execute(
        "INSERT INTO DimPost(mongo_post_id, title) VALUES (?, ?)", 
        (mongo_id, title)
    )
    cursor.execute("SELECT post_key FROM DimPost WHERE mongo_post_id = ?", (mongo_id,))
    result = cursor.fetchone()
    return result[0]


def main():
    """
    Processus ETL principal
    
    TRANSFORMATIONS:
    - Gestion valeurs manquantes: dates (fallback), tags ([]), content (""), author (filtre)
    - Agrégation: compte commentaires/tags par post, longueur contenu
    - Normalisation: dates (year/month/day), IDs MongoDB -> clés dimension
    """
    # Extraction depuis MongoDB
    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]
    users = list(db.users.find({}))
    posts = list(db.posts.find({}))
    comments = list(db.comments.find({}))
    print(f"Extraction: {len(users)} utilisateurs, {len(posts)} posts, {len(comments)} commentaires")
    
    # Connexion à SQLite
    conn = sqlite3.connect(SQLITE_PATH)
    conn.execute("PRAGMA foreign_keys = ON;")
    cur = conn.cursor()
    
    # Nettoyage
    cur.execute("DELETE FROM FactPost;")
    cur.execute("DELETE FROM DimPost;")
    cur.execute("DELETE FROM DimUser;")
    cur.execute("DELETE FROM DimDate;")
    conn.commit()
    
    # Chargement des utilisateurs
    user_key_map = {}
    for user in users:
        mongo_user_id = str(user["_id"])
        user_key = get_user_key(cur, user)
        user_key_map[mongo_user_id] = user_key
    
    # TRANSFORMATION - Chargement des faits avec filtrage et agrégation
    for post in posts:
        # TRANSFORMATION: Gestion valeurs manquantes - filtre posts sans auteur
        author = post.get("author")
        if author:
            author_id = str(author)
        else:
            author_id = None
        
        if not author_id or author_id not in user_key_map:
            continue  # Filtrage: skip posts orphelins
        
        # TRANSFORMATION: Gestion valeurs manquantes - fallback updatedAt si createdAt absent
        post_date = post.get("createdAt")
        if not post_date:
            post_date = post.get("updatedAt")
        date_id = get_date_id(cur, post_date)
        
        post_key = get_post_key(cur, post)
        
        # TRANSFORMATION: Gestion valeurs manquantes - tags ([] si None) et content ("" si None)
        tags = post.get("tags")
        if not tags:
            tags = []
        if isinstance(tags, list):
            tags_count = len(tags)  # Agrégation: compte tags
        else:
            tags_count = 0
        
        content = post.get("content")
        if not content:
            content = ""
        content_length = len(content)  # Agrégation: longueur contenu
        
        # TRANSFORMATION: Agrégation - compte commentaires par post
        post_mongo_id = str(post["_id"])
        comments_count = 0
        for comment in comments:
            comment_post_id = str(comment.get("post"))
            if comment_post_id == post_mongo_id:
                comments_count += 1
        
        # Insertion dans FactPost
        cur.execute("""
            INSERT INTO FactPost(
                date_id, user_key, post_key,
                post_count, comments_count, tags_count, content_length
            )
            VALUES (?, ?, ?, 1, ?, ?, ?)
        """, (date_id, user_key_map[author_id], post_key, comments_count, tags_count, content_length))
    
    conn.commit()
    conn.close()
    client.close()
    print("ETL terminé")


if __name__ == "__main__":
    main()
