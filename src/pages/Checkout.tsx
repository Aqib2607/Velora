import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  CreditCard,
  Smartphone,
  Truck,
  ShieldCheck,
  ChevronRight,
  Minus, Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "@/components/PaymentForm";
import api from "@/lib/axios";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

// Replace with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY || "pk_test_12345");

const paymentMethods = [
  { id: "card", name: "Credit/Debit Card", icon: CreditCard, color: "#3b82f6" },
  { id: "bkash", name: "bKash (Soon)", icon: Smartphone, color: "#E2136E", disabled: true },
  { id: "cod", name: "Cash on Delivery", icon: Truck, color: "#22c55e" },
];

export default function Checkout() {
  const { items, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const subtotal = cartTotal;
  const shipping = subtotal > 100 ? 0 : 9.99;
  const total = subtotal + shipping;

  const handlePlaceOrder = async () => {
    if (!selectedPayment) return;
    setIsLoading(true);

    try {
      const payload = {
        items: items.map(i => ({ product_id: i.id, quantity: i.quantity })),
        shipping_address: { address: "123 Test St", city: "Test City", country: "US" }, // Mock address for now
        payment_method: selectedPayment === 'card' ? 'stripe' : 'cod'
      };

      const res = await api.post("/checkout/init", payload);
      const { order_id, client_secret } = res.data.data;
      setOrderId(order_id);

      if (selectedPayment === 'card' && client_secret) {
        setClientSecret(client_secret);
      } else {
        // COD or other
        await api.post("/payment/success", { order_id });
        clearCart();
        navigate("/orders");
        toast({ title: "Order Placed", description: "Your order has been placed successfully." });
      }

    } catch (error: any) {
      toast({ variant: "destructive", title: "Checkout Failed", description: error.response?.data?.message || "Error initiating checkout" });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntent: any) => {
    try {
      await api.post("/payment/success", { order_id: orderId });
      clearCart();
      navigate("/orders");
      toast({ title: "Payment Successful", description: "Your order has been confirmed." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Payment succeeded but order finalization failed. Contact support." });
    }
  };

  return (
    <div className="min-h-screen pb-20 md:pb-8">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Cart Review */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-semibold mb-4">Review Items</h2>
              {items.length === 0 ? (
                <p className="text-muted-foreground">Your cart is empty.</p>
              ) : (
                <div className="space-y-4">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-4">
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded object-cover" />
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm">Qty: {item.quantity}</span>
                          <span className="font-bold">${item.price}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Payment Methods */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-semibold mb-6">Payment Method</h2>
              {!clientSecret ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      disabled={method.disabled}
                      onClick={() => setSelectedPayment(method.id)}
                      className={`relative p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${selectedPayment === method.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                        } ${method.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <method.icon className="h-6 w-6" style={{ color: method.color }} />
                      <span className="font-semibold">{method.name}</span>
                      {selectedPayment === method.id && (
                        <ShieldCheck className="ml-auto h-5 w-5 text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 border rounded animate-in fade-in">
                  <h3 className="font-medium mb-4">Secure Card Payment</h3>
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <PaymentForm clientSecret={clientSecret} onSuccess={handlePaymentSuccess} />
                  </Elements>
                  <Button variant="ghost" onClick={() => setClientSecret(null)} className="mt-4 w-full">
                    Change Payment Method
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              <div className="space-y-4 text-sm mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="border-t pt-4 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {!clientSecret && (
                <Button
                  size="lg"
                  disabled={items.length === 0 || !selectedPayment || isLoading}
                  onClick={handlePlaceOrder}
                  className="w-full"
                >
                  {isLoading && <span className="mr-2 animate-spin">⏳</span>}
                  {selectedPayment === 'card' ? "Proceed to Payment" : "Place Order"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
