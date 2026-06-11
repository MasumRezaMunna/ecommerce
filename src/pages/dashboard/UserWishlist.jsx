// UserWishlist.jsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Heart, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import useAuthStore from '../../context/authStore';
import useCartStore from '../../context/cartStore';
import { formatPrice } from '../../utils/helpers';
import { SkeletonCard } from '../../components/common';
import toast from 'react-hot-toast';

export default function UserWishlist() {
  const { user, updateUser } = useAuthStore();
  const { addItem } = useCartStore();
  const qc = useQueryClient();

  const { data: meData, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: () => api.get('/auth/me').then(r => r.data.data.user)
  });

  const removeMut = useMutation({
    mutationFn: id => api.post(`/auth/wishlist/${id}`),
    onSuccess: () => { qc.invalidateQueries(['me']); toast.success('Removed from wishlist'); }
  });

  const wishlist = meData?.wishlist || [];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold font-display">Wishlist</h1>
        <p className="text-neutral-500 text-sm">{wishlist.length} saved item{wishlist.length !== 1 ? 's' : ''}</p>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : wishlist.length === 0 ? (
        <div className="card p-16 text-center">
          <Heart size={48} className="mx-auto text-neutral-300 mb-4" />
          <h3 className="font-semibold mb-2">Your wishlist is empty</h3>
          <p className="text-neutral-500 text-sm mb-4">Save items you love to find them later.</p>
          <Link to="/products" className="btn btn-primary">Explore Products</Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {wishlist.map(product => (
            <div key={product._id} className="card-hover group overflow-hidden">
              <div className="relative aspect-[4/3] bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                <Link to={`/products/${product.slug}`}>
                  <img src={product.images?.[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </Link>
                <button onClick={() => removeMut.mutate(product._id)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 dark:bg-neutral-800/90 flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors shadow-sm">
                  <Heart size={15} fill="currentColor" />
                </button>
              </div>
              <div className="p-4">
                <Link to={`/products/${product.slug}`} className="text-sm font-semibold line-clamp-2 hover:text-primary-600 transition-colors">{product.name}</Link>
                <div className="flex items-center justify-between mt-3">
                  <span className="font-bold text-neutral-900 dark:text-neutral-100">{formatPrice(product.price)}</span>
                  <button onClick={() => addItem(product)} className="btn btn-primary btn-sm">
                    <ShoppingCart size={13} /> Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
