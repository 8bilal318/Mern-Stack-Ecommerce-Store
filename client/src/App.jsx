import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./store/auth-slice/Index.jsx";
import { Skeleton } from "@/components/ui/skeleton"; // Recommended for loading states

// Auth
import AuthLayout from "./components/auth/Layout.jsx";
import AuthLogin from "./pages/auth/Login.jsx";
import AuthRegister from "./pages/auth/Register.jsx";

// Admin
import AdminLayout from "./components/admin-view/Layout.jsx";
import AdminDashboard from "./pages/admin-view/Dashboard";
import AdminProducts from "./pages/admin-view/Products";
import AdminFeatures from "./pages/admin-view/Features";
import AdminOrders from "./pages/admin-view/Orders.jsx";

// Shopping
import ShoppingLayout from "./components/shopping-view/Layout";
import ShoppingHome from "./pages/shopping-view/Home";
import ShoppingListing from "./pages/shopping-view/Listing";
import ShoppingAccount from "./pages/shopping-view/Account";
import ShoppingCheckout from "./pages/shopping-view/Checkout";
import PaymentSuccess from "./pages/shopping-view/PaymentSuccess";
import PaymentCancel from "./pages/shopping-view/PaymentCancel";
import About from "./pages/shopping-view/About";
import PrivacyPolicy from "./pages/shopping-view/PrivacyPolicy";

// Extras
import NotFound from "./pages/not-found/Index";
import UnauthPage from "./pages/unauth-page/Index.jsx";
import CheckAuth from "./components/comman/CheckAuth";
import ShoppingSearch from "./pages/shopping-view/Search";

function App() {
  const { isAuthenticated, isLoading, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // Optional: Add a global loading state to prevent flickering
  if (isLoading) return <Skeleton className="w-full h-screen bg-black" />;

  return (
    // Changed bg-white to bg-black to maintain dark theme consistency
    <div className="flex flex-col overflow-hidden bg-black min-h-screen">
      <Routes>
        {/* Opening the site root (e.g. the Vite link) shows the products listing */}
        <Route path="/" element={<Navigate to="/shop/listing" replace />} />

        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
        </Route>

        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="features" element={<AdminFeatures />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>

        <Route
          path="/shop"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <ShoppingLayout />
            </CheckAuth>
          }
        >
          <Route path="home" element={<ShoppingHome />} />
          <Route path="listing" element={<ShoppingListing />} />
          <Route path="search" element={<ShoppingSearch />} />
          <Route path="account" element={<ShoppingAccount />} />
          <Route path="checkout" element={<ShoppingCheckout />} />
          <Route path="payment-success" element={<PaymentSuccess />} />
          <Route path="payment-cancel" element={<PaymentCancel />} />
          <Route path="about" element={<About />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />          
        </Route>

        <Route path="/unauth-page" element={<UnauthPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
