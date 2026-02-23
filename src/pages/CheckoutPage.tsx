import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { useRegionStore } from "@/store/useRegionStore";
import { convertAndFormat } from "@/utils/currency";
import { useTranslation } from "react-i18next";

const CheckoutPage = () => {
  const { items, totalPrice, clearCart } = useCartStore();
  const { currency, locale, taxRate } = useRegionStore();
  const totalInUSD = totalPrice();
  const [placed, setPlaced] = useState(false);
  const { t } = useTranslation();

  if (placed) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold mb-2">{t('checkout.order_placed')}</h1>
        <p className="text-muted-foreground">{t('checkout.thank_you')}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">{t('checkout.title')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <h2 className="font-semibold mb-4">{t('checkout.shipping_address')}</h2>
            <div className="space-y-3">
              <input placeholder={t('checkout.full_name')} className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              <input placeholder={t('checkout.address_line_1')} className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              <div className="grid grid-cols-2 gap-3">
                <input placeholder={t('checkout.city')} className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                <input placeholder={t('checkout.zip_code')} className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
          </div>
          <div>
            <h2 className="font-semibold mb-4">{t('checkout.payment_method')}</h2>
            <div className="space-y-2">
              {["Credit Card", "PayPal", "Bank Transfer"].map((m) => (
                <label key={m} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card cursor-pointer hover:border-primary/50 transition-colors">
                  <input type="radio" name="payment" defaultChecked={m === "Credit Card"} className="accent-primary" />
                  <span className="text-sm">{m}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 h-fit sticky top-24">
          <h2 className="font-bold text-lg mb-4">{t('cart.order_summary')}</h2>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {items.map((item) => (
              <div key={item.product.id} className="flex items-center gap-3 text-sm">
                <img src={item.product.image} alt="" className="h-10 w-10 rounded object-cover" />
                <span className="flex-1 truncate">{item.product.name} × {item.quantity}</span>
                <span className="font-medium">{convertAndFormat(item.product.price * item.quantity, currency, locale)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-border mt-4 pt-4 flex justify-between font-bold text-lg">
            <span>{t('cart.total')}</span>
            <span>{convertAndFormat(totalInUSD + (totalInUSD > 50 ? 0 : 5.99) + totalInUSD * taxRate, currency, locale)}</span>
          </div>
          <button
            onClick={() => { clearCart(); setPlaced(true); }}
            className="mt-4 w-full rounded-lg gradient-accent px-6 py-3 font-bold text-accent-foreground hover:opacity-90 transition-opacity"
          >
            {t('checkout.place_order')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
