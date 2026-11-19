import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children ,isLoading }) {
  const location = useLocation();
  if (isLoading) return <div>Loading...</div>

  // The products listing is public: guests can browse without logging in
  const isPublicPage = location.pathname.startsWith("/shop/listing");

  // Handle root route
  if (location.pathname === "/") {
    if (!isAuthenticated) {
      return <Navigate to="/auth/login" />;
    }

    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    } else {
      return <Navigate to="/shop/home" />;
    }
  }

  // If NOT authenticated and trying to access protected routes
  if (
    !isAuthenticated &&
    !isPublicPage &&
    !location.pathname.includes("/login") &&
    !location.pathname.includes("/register")
  ) {
    return <Navigate to="/auth/login" />;
  }

  // If authenticated but trying to access login/register
  if (
    isAuthenticated &&
    (location.pathname.includes("/login") ||
      location.pathname.includes("/register"))
  ) {
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    } else {
      return <Navigate to="/shop/home" />;
    }
  }

   // Prevent normal users from accessing admin routes
  if (
    isAuthenticated &&
    user?.role !== "admin" &&
    location.pathname.includes("/admin")
  ) {
    return <Navigate to="/unauth-page" />;
  }

  return <>{children}</>;
}

export default CheckAuth;