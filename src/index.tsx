import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AboutPage } from "./screens/AboutPage";
import { BlogPage, BlogPostPage } from "./screens/BlogPage";
import { ContactPage } from "./screens/ContactPage";
import { Homepage } from "./screens/Homepage";
import { Login } from "./screens/Admin/Login";
import { Dashboard } from "./pages/admin/Dashboard";
import { ProtectedRoute } from "./guards/ProtectedRoute";
import { AuthProvider } from "./hooks/useAuth";
import ScrollToTop from "./components/ScrollToTop";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
