import { Link } from "react-router-dom";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useRegionStore } from "@/store/useRegionStore";
import { convertAndFormat, convertAmount } from "@/utils/currency";
import { useTranslation } from "react-i18next";

const CartPage = () => {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore();
  const { currency, locale, taxRate } = useRegionStore();
  const totalInUSD = totalPrice();
  const { t } = useTranslation();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">{t('cart.empty')}</h1>
        <p className="text-muted-foreground mb-6">{t('cart.continue_shopping')}</p>
        <Link to="/" className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:opacity-90 transition-opacity">
          {t('cart.continue_shopping')}
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t('cart.shopping_cart')} ({items.length} {t('cart.items')})</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.product.id} className="flex gap-4 p-4 rounded-xl border border-border bg-card">
              <Link to={`/product/${item.product.id}`}>
                <img src={item.product.image} alt={item.product.name} className="h-24 w-24 rounded-lg object-cover" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/product/${item.product.id}`}>
                  <h3 className="font-medium truncate hover:text-primary transition-colors">{item.product.name}</h3>
                </Link>
                <p className="text-sm text-muted-foreground">{item.product.seller}</p>
                <p className="font-bold mt-1">{convertAndFormat(item.product.price, currency, locale)}</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center border border-border rounded-lg">
                    <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="p-1.5 hover:bg-muted transition-colors"><Minus className="h-3 w-3" /></button>
                    <span className="px-3 text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="p-1.5 hover:bg-muted transition-colors"><Plus className="h-3 w-3" /></button>
                  </div>
                  <button onClick={() => removeItem(item.product.id)} className="text-destructive hover:opacity-70 transition-opacity"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <p className="font-bold">{convertAndFormat(item.product.price * item.quantity, currency, locale)}</p>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="rounded-xl border border-border bg-card p-6 sticky top-24">
            <h2 className="font-bold text-lg mb-4">{t('cart.order_summary')}</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">{t('cart.subtotal')}</span><span>{convertAndFormat(totalInUSD, currency, locale)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">{t('cart.shipping')}</span><span>{totalInUSD > 50 ? t('cart.free') : convertAndFormat(5.99, currency, locale)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">{t('cart.tax')} ({Math.round(taxRate * 100)}%)</span><span>{convertAndFormat(totalInUSD * taxRate, currency, locale)}</span></div>
            </div>
            <div className="border-t border-border mt-4 pt-4 flex justify-between font-bold text-lg">
              <span>{t('cart.total')}</span>
              <span>{convertAndFormat(totalInUSD + (totalInUSD > 50 ? 0 : 5.99) + totalInUSD * taxRate, currency, locale)}</span>
            </div>
            <Link
              to="/checkout"
              className="mt-4 w-full flex items-center justify-center rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:opacity-90 transition-opacity"
            >
              {t('cart.proceed_to_checkout')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
