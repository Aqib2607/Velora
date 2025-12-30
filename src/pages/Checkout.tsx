import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Minus, 
  Plus, 
  Trash2, 
  CreditCard, 
  Smartphone,
  Truck,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const cartItems = [
  {
    id: 1,
    name: "Premium Wireless Headphones Pro Max",
    price: 299.99,
    quantity: 1,
    color: "Midnight Black",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop",
  },
  {
    id: 2,
    name: "Smart Watch Ultra Series 9",
    price: 449.00,
    quantity: 2,
    color: "Silver",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop",
  },
];

const paymentMethods = [
  { id: "bkash", name: "bKash", icon: Smartphone, color: "#E2136E" },
  { id: "nagad", name: "Nagad", icon: Smartphone, color: "#F6921E" },
  { id: "card", name: "Credit/Debit Card", icon: CreditCard, color: "#3b82f6" },
  { id: "cod", name: "Cash on Delivery", icon: Truck, color: "#22c55e" },
];

export default function Checkout() {
  const [items, setItems] = useState(cartItems);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(true);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 9.99;
  const total = subtotal + shipping;

  const updateQuantity = (id: number, change: number) => {
    setItems(items.map(item => 
      item.id === id 
        ? { ...item, quantity: Math.max(1, item.quantity + change) }
        : item
    ));
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen pb-20 md:pb-8">
      <div className="container mx-auto px-4 py-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-8"
        >
          Checkout
        </motion.h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-4"
          >
            <div className="glass-card p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center justify-between">
                <span>Shopping Cart ({items.length} items)</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                  onClick={() => setIsCartOpen(!isCartOpen)}
                >
                  {isCartOpen ? "Hide" : "Show"}
                </Button>
              </h2>

              <AnimatePresence>
                {isCartOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-4 overflow-hidden"
                  >
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="flex gap-4 p-4 rounded-xl bg-secondary/30"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold line-clamp-1">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">{item.color}</p>
                          <p className="font-bold mt-1">${item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex flex-col items-end justify-between">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateQuantity(item.id, -1)}
                              className="h-8 w-8 rounded-lg"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateQuantity(item.id, 1)}
                              className="h-8 w-8 rounded-lg"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Payment Methods */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6"
            >
              <h2 className="text-xl font-semibold mb-6">Payment Method</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {paymentMethods.map((method) => (
                  <motion.button
                    key={method.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedPayment(method.id)}
                    className={`relative p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                      selectedPayment === method.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    style={{
                      boxShadow: selectedPayment === method.id 
                        ? `0 0 20px ${method.color}40` 
                        : undefined
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${method.color}20` }}
                    >
                      <method.icon className="h-6 w-6" style={{ color: method.color }} />
                    </div>
                    <span className="font-semibold">{method.name}</span>
                    {selectedPayment === method.id && (
                      <motion.div
                        layoutId="selectedPayment"
                        className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                      >
                        <ShieldCheck className="h-3 w-3 text-primary-foreground" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="glass-card p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-500">FREE</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-medium">Calculated at checkout</span>
                </div>
                
                <div className="h-px bg-border my-4" />
                
                <div className="flex justify-between text-lg">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold">${total.toFixed(2)}</span>
                </div>
              </div>

              <Button
                size="lg"
                disabled={!selectedPayment}
                className="w-full h-14 mt-6 gradient-bg text-primary-foreground font-semibold text-lg rounded-xl glow"
              >
                Place Order
                <ChevronRight className="h-5 w-5 ml-2" />
              </Button>

              <p className="text-xs text-center text-muted-foreground mt-4">
                By placing your order, you agree to our Terms of Service and Privacy Policy.
              </p>

              {/* Promo Code */}
              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Promo code"
                    className="flex-1 h-11 px-4 rounded-lg bg-secondary/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Button variant="outline" className="h-11 px-4">
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
