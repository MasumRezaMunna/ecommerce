import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import useCartStore from '../context/cartStore';
import { formatPrice } from '../utils/helpers';

export default function Cart() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal >= 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (items.length === 0) return (
    <div className="container-xl py-24 text-center">
      <ShoppingBag size={64} className="mx-auto text-neutral-300 dark:text-neutral-700 mb-6" />
      <h1 className="text-2xl font-bold font-display mb-2">Your cart is empty</h1>
      <p className="text-neutral-500 mb-8">Looks like you haven't added anything yet.</p>
      <Link to="/products" className="btn btn-primary btn-lg">Start Shopping</Link>
    </div>
  );

  return (
    <div className="container-xl py-12 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold font-display">Shopping Cart <span className="text-neutral-400 text-xl font-normal">({items.reduce((s,i) => s+i.quantity,0)} items)</span></h1>
        <button onClick={clearCart} className="btn btn-ghost text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm">
          <Trash2 size={16} /> Clear Cart
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item._id} className="card flex gap-4 p-4">
              <Link to={`/products/${item.slug}`} className="shrink-0">
                <img src={item.images?.[0]} alt={item.name}
                  className="w-24 h-24 object-cover rounded-xl border border-neutral-100 dark:border-neutral-700" />
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap justify-between gap-2">
                  <Link to={`/products/${item.slug}`} className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 hover:text-primary-600 transition-colors line-clamp-2">
                    {item.name}
                  </Link>
                  <button onClick={() => removeItem(item._id)} className="btn-ghost btn-icon btn-sm text-red-400 hover:text-red-600" aria-label="Remove item">
                    <Trash2 size={15} />
                  </button>
                </div>
                {item.brand && <p className="text-xs text-neutral-400 mt-0.5">{item.brand}</p>}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden">
                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)} disabled={item.quantity <= 1}
                      className="px-2.5 py-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors disabled:opacity-40" aria-label="Decrease">
                      <Minus size={14} />
                    </button>
                    <span className="px-3 py-1.5 text-sm font-medium border-x border-neutral-200 dark:border-neutral-700 min-w-[2.5rem] text-center">
                      {item.quantity}
                    </span>
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="px-2.5 py-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors" aria-label="Increase">
                      <Plus size={14} />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-neutral-900 dark:text-neutral-100">{formatPrice(item.price * item.quantity)}</p>
                    {item.quantity > 1 && <p className="text-xs text-neutral-400">{formatPrice(item.price)} each</p>}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <Link to="/products" className="inline-flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 hover:gap-3 transition-all font-medium mt-2">
            ← Continue Shopping
          </Link>
        </div>

        {/* Summary */}
        <div className="space-y-4">
          <div className="card p-6 space-y-4">
            <h2 className="text-lg font-bold font-display">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">Subtotal ({items.reduce((s,i) => s+i.quantity,0)} items)</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Shipping</span>
                <span className={shipping === 0 ? 'text-green-600 font-medium' : 'font-medium'}>
                  {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Tax (8%)</span>
                <span className="font-medium">{formatPrice(tax)}</span>
              </div>
              {shipping > 0 && (
                <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-3 text-xs text-primary-700 dark:text-primary-300">
                  🚚 Add {formatPrice(100 - subtotal)} more for free shipping!
                </div>
              )}
              <div className="divider !my-2" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary-600 dark:text-primary-400">{formatPrice(total)}</span>
              </div>
            </div>

            <Link to="/checkout" className="btn btn-primary w-full btn-lg">
              Proceed to Checkout <ArrowRight size={18} />
            </Link>
          </div>

          {/* Promo code */}
          <div className="card p-4">
            <p className="text-sm font-medium mb-2 flex items-center gap-2"><Tag size={14} /> Promo Code</p>
            <div className="flex gap-2">
              <input className="input flex-1 text-sm" placeholder="Enter code" aria-label="Promo code" />
              <button className="btn btn-secondary btn-sm">Apply</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
