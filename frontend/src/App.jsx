import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { PostsListPage } from "./pages/PostsListPage";
import { PostDetailPage } from "./pages/PostDetailPage";
import { NewPostPage } from "./pages/NewPostPage";
import { ProfilePage } from "./pages/ProfilePage";
import { UsersPage } from "./pages/UsersPage";
import { TagsPage } from "./pages/TagsPage";
import PowerBIPage from "./pages/PowerBIPage";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/posts" element={<PostsListPage />} />
          <Route path="/posts/:id" element={<PostDetailPage />} />
          <Route
            path="/new-post"
            element={
              <ProtectedRoute>
                <NewPostPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <AdminRoute>
                <UsersPage />
              </AdminRoute>
            }
          />
          <Route
            path="/tags"
            element={
              <AdminRoute>
                <TagsPage />
              </AdminRoute>
            }
          />
          <Route path="/analytics" element={<PowerBIPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
