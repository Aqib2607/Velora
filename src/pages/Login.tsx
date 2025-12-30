import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Store,
  ArrowRight,
  Github,
  Chrome,
  Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<"customer" | "vendor">("customer");

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Illustration */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 gradient-bg relative overflow-hidden"
      >
        {/* Floating Elements */}
        <div className="absolute inset-0">
          <motion.div
            animate={{ y: [0, -30, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-20 w-24 h-24 rounded-2xl bg-primary-foreground/10 backdrop-blur-sm"
          />
          <motion.div
            animate={{ y: [0, 20, 0], rotate: [0, -15, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-40 right-32 w-32 h-32 rounded-full bg-primary-foreground/10 backdrop-blur-sm"
          />
          <motion.div
            animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-32 left-40 w-20 h-20 rounded-xl bg-primary-foreground/10 backdrop-blur-sm rotate-45"
          />
          <motion.div
            animate={{ y: [0, 25, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute bottom-40 right-20 w-16 h-16 rounded-full bg-primary-foreground/10 backdrop-blur-sm"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center p-12 text-primary-foreground">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-4xl font-bold mb-6">
              Welcome to<br />E-Commerce Velora
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-md">
              Join thousands of customers and vendors on the most advanced
              e-commerce platform. Experience shopping like never before.
            </p>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold">50K+</div>
                <div className="text-sm text-primary-foreground/70">Products</div>
              </div>
              <div className="w-px h-12 bg-primary-foreground/30" />
              <div className="text-center">
                <div className="text-3xl font-bold">10K+</div>
                <div className="text-sm text-primary-foreground/70">Vendors</div>
              </div>
              <div className="w-px h-12 bg-primary-foreground/30" />
              <div className="text-center">
                <div className="text-3xl font-bold">99%</div>
                <div className="text-sm text-primary-foreground/70">Satisfaction</div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Form */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full lg:w-1/2 flex items-center justify-center p-8"
      >
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">N</span>
            </div>
            <span className="font-bold text-2xl">Velora</span>
          </Link>

          <div className="glass-card p-8">
            <h1 className="text-2xl font-bold mb-2">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-muted-foreground mb-6">
              {isLogin
                ? "Enter your credentials to access your account"
                : "Sign up to start your shopping journey"}
            </p>

            {/* User Type Tabs (for registration) */}
            {!isLogin && (
              <Tabs
                value={userType}
                onValueChange={(v) => setUserType(v as "customer" | "vendor")}
                className="mb-6"
              >
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="customer" className="gap-2">
                    <User className="h-4 w-4" />
                    Customer
                  </TabsTrigger>
                  <TabsTrigger value="vendor" className="gap-2">
                    <Store className="h-4 w-4" />
                    Vendor
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            )}

            <form className="space-y-4">
              {!isLogin && (
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full h-12 pl-12 pr-4 rounded-xl bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              )}

              {!isLogin && userType === "vendor" && (
                <>
                  <div className="relative">
                    <Store className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Store Name"
                      className="w-full h-12 pl-12 pr-4 rounded-xl bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      className="w-full h-12 pl-12 pr-4 rounded-xl bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </>
              )}

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full h-12 pl-12 pr-4 rounded-xl bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full h-12 pl-12 pr-12 rounded-xl bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {isLogin && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-border" />
                    <span className="text-muted-foreground">Remember me</span>
                  </label>
                  <a href="#" className="text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full h-12 gradient-bg text-primary-foreground font-semibold rounded-xl glow"
              >
                {isLogin ? "Sign In" : "Create Account"}
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="px-2 bg-card text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-12 rounded-xl glass">
                <Chrome className="h-5 w-5 mr-2" />
                Google
              </Button>
              <Button variant="outline" className="h-12 rounded-xl glass">
                <Github className="h-5 w-5 mr-2" />
                GitHub
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-6">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary font-semibold hover:underline"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
