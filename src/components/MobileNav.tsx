import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ShoppingCart, User, Search, Grid, Store, HelpCircle } from "lucide-react";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/products", icon: Grid, label: "Products" },
  { href: "/vendor-dashboard", icon: Store, label: "Vendor" },
  { href: "/search", icon: Search, label: "Search" },

  { href: "/checkout", icon: ShoppingCart, label: "Cart" },
  { href: "/login", icon: User, label: "Account" },
];

export function MobileNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass border-t border-border/50">
      <div className="flex items-center justify-between h-16 px-0 w-full">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              to={item.href}
              className="relative flex flex-col items-center justify-center flex-1 h-full min-w-0"
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`flex flex-col items-center gap-1 ${isActive ? "text-primary" : "text-muted-foreground"
                  }`}
              >
                <div className="relative">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  {item.href === "/checkout" && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center font-medium">
                      3
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium" aria-hidden={!isActive ? "true" : "false"}>{item.label}</span>

              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
