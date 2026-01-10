import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, User, Search, Menu } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/vendor-dashboard", label: "Vendor" },
  { href: "/checkout", label: "Cart" },
];

export function Header() {
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { cartCount } = useCart();

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full glass border-b border-border/50"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">V</span>
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:inline">
              Velora
            </span>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="relative py-2"
            >
              <motion.span
                className={`text-sm font-medium transition-colors ${location.pathname === link.href
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
                whileHover={{ y: -2 }}
              >
                {link.label}
              </motion.span>
              {location.pathname === link.href && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <motion.div
            initial={false}
            animate={{ width: isSearchOpen ? 200 : 40 }}
            className="relative"
          >
            {isSearchOpen && (
              <motion.input
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                type="text"
                placeholder="Search..."
                className="w-full h-10 pl-10 pr-4 rounded-full bg-secondary/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
                onBlur={() => setIsSearchOpen(false)}
              />
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`h-10 w-10 rounded-full ${isSearchOpen ? "absolute left-0 top-0" : ""}`}
            >
              <Search className="h-5 w-5" />
            </Button>
          </motion.div>

          <ThemeToggle />

          <Link to="/checkout">
            <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>

          <Link to="/login">
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
              <User className="h-5 w-5" />
            </Button>
          </Link>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden h-10 w-10 rounded-full">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link
                      to={link.href}
                      className={`text-lg font-medium transition-colors ${location.pathname === link.href
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
