## Simple MERN Blog App

Very small MERN project with auth, 5 entities and relations:

- User (1-to-1 Profile, 1-to-many Posts)
- Profile (1-to-1 User)
- Post (1-to-many Comments, many-to-many Tags)
- Comment (many-to-1 Post, many-to-1 User)
- Tag (many-to-many Posts)

### 1. Backend (Express + MongoDB)

Located in `backend/`.

- Install:
  - `cd backend`
  - `npm install`
- Configure:
  - Create `.env` (copy values from instructions or class requirements):
    - `MONGO_URI=mongodb://localhost:27017/simple_mern_blog`
    - `JWT_SECRET=your_jwt_secret_here`
    - `PORT=5000`
- Run:
  - `npm start`

Main endpoints (all under `/api`):

- Auth:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `POST /api/auth/logout`
- Users (JWT required):
  - `GET /api/users`
  - `GET /api/users/:id`
  - `PUT /api/users/:id`
  - `DELETE /api/users/:id`
- Profile (JWT required):
  - `GET /api/profiles/me`
  - `PUT /api/profiles/me`
- Posts:
  - `GET /api/posts`
  - `GET /api/posts/me` (JWT)
  - `GET /api/posts/:id`
  - `POST /api/posts` (JWT)
  - `PUT /api/posts/:id` (JWT, author only)
  - `DELETE /api/posts/:id` (JWT, author only)
- Comments (on a post):
  - `GET /api/posts/:postId/comments`
  - `POST /api/posts/:postId/comments` (JWT)
  - `PUT /api/posts/:postId/comments/:commentId` (JWT, author only)
  - `DELETE /api/posts/:postId/comments/:commentId` (JWT, author only)
- Tags:
  - `GET /api/tags`
  - `GET /api/tags/:id`
  - `POST /api/tags` (JWT)
  - `PUT /api/tags/:id` (JWT)
  - `DELETE /api/tags/:id` (JWT)

Security & Access Control:

- Passwords hashed with `bcryptjs`
- JWT authentication (`Authorization: Bearer <token>`)
- Role-based access control (RBAC):
  - **user** (default) - Can create posts, comments, manage own profile
  - **admin** - Can manage users, tags, plus all user permissions
- See `backend/RBAC.md` for detailed documentation

**Admin credentials (after running seed script):**
- Email: `admin@example.com`
- Password: `password123`

### 2. Frontend (React + Vite)

Located in `frontend/`.

- Install:
  - `cd frontend`
  - `npm install`
- Run dev server:
  - `npm run dev`

Pages:

- Home (`/`) – Landing page with links to posts, login/register (if not authenticated), or create post (if authenticated)
- Login (`/login`) – uses `POST /api/auth/login`
- Register (`/register`) – uses `POST /api/auth/register`
- Posts list (`/posts`) – uses `GET /api/posts` and `GET /api/posts/me`
- Post detail (`/posts/:id`) – uses:
  - `GET /api/posts/:id`
  - `GET /api/posts/:id/comments`
  - `POST /api/posts/:id/comments`
  - `PUT /api/posts/:id/comments/:commentId`
  - `DELETE /api/posts/:id/comments/:commentId`
  - `PUT /api/posts/:id`
  - `DELETE /api/posts/:id`
- New post (`/new-post`) – uses `POST /api/posts` (Protected)
- Profile (`/profile`) – uses `GET /api/profiles/me`, `PUT /api/profiles/me` (Protected)
- Users (`/users`) – uses all `/api/users` routes (Admin only)
- Tags (`/tags`) – uses all `/api/tags` routes (Admin only)

Protected routes are wrapped with:
- `ProtectedRoute` component - Requires authentication
- `AdminRoute` component - Requires admin role (redirects to access denied page for regular users)

Styling: Uses inline styles with a consistent color palette (slate colors) throughout the application.


