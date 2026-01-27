import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileNav } from "@/components/MobileNav";
import { AIChatbot } from "@/components/AIChatbot";
import { ScrollToTop } from "@/components/ScrollToTop";
import React, { Suspense } from "react";
import SEO from "@/components/SEO";

// Lazy Load Pages
const Index = React.lazy(() => import("./pages/Index"));
const Products = React.lazy(() => import("./pages/Products"));
const ProductDetails = React.lazy(() => import("./pages/ProductDetails"));
const Checkout = React.lazy(() => import("./pages/Checkout"));
const Login = React.lazy(() => import("./pages/Login"));
const Register = React.lazy(() => import("./pages/Register"));
const ForgotPassword = React.lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = React.lazy(() => import("./pages/ResetPassword"));
const SecurityPanel = React.lazy(() => import("./pages/SecurityPanel"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const Profile = React.lazy(() => import("./pages/Profile"));
const Orders = React.lazy(() => import("./pages/Orders"));
const Wishlist = React.lazy(() => import("./pages/Wishlist"));
const Addresses = React.lazy(() => import("./pages/Addresses"));
const Categories = React.lazy(() => import("./pages/Categories"));
const SearchResults = React.lazy(() => import("./pages/SearchResults"));
const Deals = React.lazy(() => import("./pages/Deals"));
const About = React.lazy(() => import("./pages/About"));
const Contact = React.lazy(() => import("./pages/Contact"));
const VendorDashboard = React.lazy(() => import("./pages/VendorDashboard"));
const ShippingPolicy = React.lazy(() => import("./pages/ShippingPolicy"));
const UserDashboard = React.lazy(() => import("./pages/UserDashboard"));
const Settings = React.lazy(() => import("./pages/Settings"));
const VerifyEmail = React.lazy(() => import("./pages/VerifyEmail"));
const VerifyPrompt = React.lazy(() => import("./pages/VerifyPrompt"));
const OrderList = React.lazy(() => import("./pages/admin/OrderList"));

// Component Imports
import { CartProvider } from "@/contexts/CartContext";
import RequireAuth from "./components/RequireAuth";
import RequireRole from "./components/RequireRole";
import DashboardLayout from "./components/DashboardLayout";

// Loading Component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

const queryClient = new QueryClient();

function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";
  const isSecurityPage = location.pathname === "/admin/security";

  if (isAuthPage || isSecurityPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
      <MobileNav />
      <AIChatbot />
      <ScrollToTop />
    </>
  );
}

import { HelmetProvider } from "react-helmet-async";

// ... existing imports

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="velora-theme" attribute="class" enableSystem>
        <TooltipProvider>
          <CartProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <AppLayout>
                <Suspense fallback={<PageLoader />}>
                  <SEO title="Home" description="Welcome to Velora, your premium shopping destination." />
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Index />} />
                    <Route path="/products" element={<>
                      <SEO title="Products" description="Browse our collection of premium products." />
                      <Products />
                    </>} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/auth/forgot-password" element={<ForgotPassword />} />
                    <Route path="/password-reset" element={<ResetPassword />} />
                    <Route path="/verify-email/:id/:hash" element={<VerifyEmail />} />
                    <Route path="/verify-prompt" element={<VerifyPrompt />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/search" element={<SearchResults />} />
                    <Route path="/deals" element={<Deals />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/shipping-policy" element={<ShippingPolicy />} />

                    {/* Protected Routes */}
                    <Route element={<RequireAuth />}>
                      <Route element={<DashboardLayout />}>
                        <Route path="/dashboard" element={<UserDashboard />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/wishlist" element={<Wishlist />} />
                        <Route path="/addresses" element={<Addresses />} />
                        <Route path="/settings" element={<Settings />} />
                      </Route>
                    </Route>

                    {/* Role Protected Routes */}
                    <Route element={<RequireRole role="admin" />}>
                      <Route path="/admin/security" element={<SecurityPanel />} />
                      <Route path="/admin/orders" element={<OrderList />} />
                    </Route>

                    <Route element={<RequireRole role="shop_owner" />}>
                      <Route path="/vendor-dashboard" element={<VendorDashboard />} />
                    </Route>

                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </AppLayout>
            </BrowserRouter>
          </CartProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
