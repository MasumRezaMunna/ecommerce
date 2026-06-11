import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { CreditCard, Check, ChevronRight, Lock } from 'lucide-react';
import api from '../utils/api';
import useCartStore from '../context/cartStore';
import useAuthStore from '../context/authStore';
import { formatPrice } from '../utils/helpers';
import { Alert } from '../components/common';
import toast from 'react-hot-toast';

const STEPS = ['Shipping', 'Payment', 'Review'];

export default function Checkout() {
  const [step, setStep] = useState(0);
  const [shippingData, setShippingData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const { items, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal >= 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const placeOrder = useMutation({
    mutationFn: (payload) => api.post('/orders', payload),
    onSuccess: (res) => {
      clearCart();
      toast.success('Order placed successfully! 🎉');
      navigate('/dashboard/orders');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Order failed'),
  });

  const {
    register, handleSubmit, formState: { errors }
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      zip: user?.address?.zip || '',
      country: user?.address?.country || 'US',
      phone: user?.phone || '',
    }
  });

  const onShippingSubmit = (data) => {
    setShippingData(data);
    setStep(1);
  };

  const handlePlaceOrder = () => {
    placeOrder.mutate({
      items: items.map(i => ({ product: i._id, quantity: i.quantity })),
      shippingAddress: shippingData,
      paymentMethod,
    });
  };

  return (
    <div className="container-xl py-12 max-w-5xl">
      <h1 className="text-3xl font-bold font-display mb-8">Checkout</h1>

      {/* Stepper */}
      <div className="flex items-center mb-10">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              i < step ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : i === step ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
              : 'bg-neutral-100 text-neutral-400 dark:bg-neutral-800'
            }`}>
              {i < step ? <Check size={14} /> : <span className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center text-xs">{i+1}</span>}
              {s}
            </div>
            {i < STEPS.length - 1 && <ChevronRight size={16} className="text-neutral-300 mx-1" />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Step 0: Shipping */}
          {step === 0 && (
            <div className="card p-6">
              <h2 className="text-lg font-bold mb-6">Shipping Address</h2>
              <form onSubmit={handleSubmit(onShippingSubmit)} className="space-y-4">
                <div>
                  <label className="label" htmlFor="name">Full Name <span className="text-red-500">*</span></label>
                  <input id="name" className={`input ${errors.name ? 'input-error' : ''}`}
                    {...register('name', { required: 'Name is required' })} />
                  {errors.name && <p className="error-msg">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="label" htmlFor="phone">Phone Number</label>
                  <input id="phone" className="input" {...register('phone')} placeholder="+1 555 123 4567" />
                </div>
                <div>
                  <label className="label" htmlFor="street">Street Address <span className="text-red-500">*</span></label>
                  <input id="street" className={`input ${errors.street ? 'input-error' : ''}`}
                    {...register('street', { required: 'Street address is required' })} />
                  {errors.street && <p className="error-msg">{errors.street.message}</p>}
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label" htmlFor="city">City <span className="text-red-500">*</span></label>
                    <input id="city" className={`input ${errors.city ? 'input-error' : ''}`}
                      {...register('city', { required: 'City is required' })} />
                    {errors.city && <p className="error-msg">{errors.city.message}</p>}
                  </div>
                  <div>
                    <label className="label" htmlFor="state">State <span className="text-red-500">*</span></label>
                    <input id="state" className={`input ${errors.state ? 'input-error' : ''}`}
                      {...register('state', { required: 'State is required' })} />
                    {errors.state && <p className="error-msg">{errors.state.message}</p>}
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label" htmlFor="zip">ZIP Code <span className="text-red-500">*</span></label>
                    <input id="zip" className={`input ${errors.zip ? 'input-error' : ''}`}
                      {...register('zip', { required: 'ZIP code is required' })} />
                    {errors.zip && <p className="error-msg">{errors.zip.message}</p>}
                  </div>
                  <div>
                    <label className="label" htmlFor="country">Country</label>
                    <select id="country" className="input" {...register('country')}>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="GB">United Kingdom</option>
                      <option value="AU">Australia</option>
                      <option value="BD">Bangladesh</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary w-full mt-4">Continue to Payment</button>
              </form>
            </div>
          )}

          {/* Step 1: Payment */}
          {step === 1 && (
            <div className="card p-6">
              <h2 className="text-lg font-bold mb-6">Payment Method</h2>
              <div className="space-y-3 mb-6">
                {[
                  { id: 'card', label: 'Credit / Debit Card', icon: '💳', desc: 'Visa, Mastercard, AmEx' },
                  { id: 'paypal', label: 'PayPal', icon: '🅿️', desc: 'Pay with your PayPal account' },
                  { id: 'cod', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when your order arrives' },
                ].map(m => (
                  <label key={m.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === m.id ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300'
                  }`}>
                    <input type="radio" name="payment" value={m.id} checked={paymentMethod === m.id}
                      onChange={() => setPaymentMethod(m.id)} className="accent-primary-600" />
                    <span className="text-2xl">{m.icon}</span>
                    <div>
                      <p className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">{m.label}</p>
                      <p className="text-xs text-neutral-400">{m.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              {paymentMethod === 'card' && (
                <div className="space-y-4 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl mb-6">
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
                    <Lock size={14} /> Demo mode — no real card needed
                  </p>
                  <div>
                    <label className="label">Card Number</label>
                    <input className="input" placeholder="4242 4242 4242 4242" readOnly defaultValue="4242 4242 4242 4242" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Expiry</label>
                      <input className="input" placeholder="MM/YY" readOnly defaultValue="12/26" />
                    </div>
                    <div>
                      <label className="label">CVV</label>
                      <input className="input" placeholder="123" readOnly defaultValue="123" />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => setStep(0)} className="btn btn-secondary flex-1">← Back</button>
                <button onClick={() => setStep(2)} className="btn btn-primary flex-1">Review Order</button>
              </div>
            </div>
          )}

          {/* Step 2: Review */}
          {step === 2 && (
            <div className="card p-6">
              <h2 className="text-lg font-bold mb-6">Review Your Order</h2>

              <div className="mb-6">
                <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3">Shipping to</h3>
                <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-4 text-sm text-neutral-600 dark:text-neutral-400">
                  <p className="font-medium text-neutral-900 dark:text-neutral-100">{shippingData?.name}</p>
                  <p>{shippingData?.street}</p>
                  <p>{shippingData?.city}, {shippingData?.state} {shippingData?.zip}</p>
                  <p>{shippingData?.country}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3">Items</h3>
                <div className="space-y-3">
                  {items.map(item => (
                    <div key={item._id} className="flex items-center gap-3">
                      <img src={item.images?.[0]} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">{item.name}</p>
                        <p className="text-xs text-neutral-400">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-sm">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Alert type="info" message="This is a demo. No real payment will be processed." />

              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(1)} className="btn btn-secondary flex-1">← Back</button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={placeOrder.isPending}
                  className="btn btn-primary flex-1"
                >
                  {placeOrder.isPending ? 'Placing Order...' : `Place Order · ${formatPrice(total)}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Summary sidebar */}
        <div className="card p-5 h-fit sticky top-24">
          <h3 className="font-bold mb-4">Order Summary</h3>
          <div className="space-y-2 text-sm mb-4">
            {items.map(i => (
              <div key={i._id} className="flex justify-between">
                <span className="text-neutral-500 truncate mr-2">{i.name} ×{i.quantity}</span>
                <span className="font-medium shrink-0">{formatPrice(i.price * i.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="divider" />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-neutral-500">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Shipping</span><span className={shipping === 0 ? 'text-green-600' : ''}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Tax</span><span>{formatPrice(tax)}</span></div>
            <div className="divider !my-2" />
            <div className="flex justify-between font-bold text-base">
              <span>Total</span>
              <span className="text-primary-600">{formatPrice(total)}</span>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-neutral-400">
            <Lock size={12} /> Secured by 256-bit SSL encryption
          </div>
        </div>
      </div>
    </div>
  );
}
