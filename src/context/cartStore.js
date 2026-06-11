import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) => {
        const { items } = get();
        const existing = items.find(i => i._id === product._id);
        if (existing) {
          set({ items: items.map(i => i._id === product._id ? { ...i, quantity: i.quantity + quantity } : i) });
          toast.success('Cart updated');
        } else {
          set({ items: [...items, { ...product, quantity }] });
          toast.success('Added to cart');
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter(i => i._id !== productId) });
        toast.success('Removed from cart');
      },

      updateQuantity: (productId, quantity) => {
        if (quantity < 1) return;
        set({ items: get().items.map(i => i._id === productId ? { ...i, quantity } : i) });
      },

      clearCart: () => set({ items: [] }),

      get itemCount() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },

      get subtotal() {
        return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      },
    }),
    { name: 'revenio-cart' }
  )
);

export default useCartStore;
