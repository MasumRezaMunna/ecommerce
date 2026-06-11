import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { useState } from 'react';
import { formatPrice, getDiscountPercent } from '../../utils/helpers';
import useCartStore from '../../context/cartStore';
import useAuthStore from '../../context/authStore';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const { addItem } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();

  const discount = getDiscountPercent(product.price, product.originalPrice);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addItem(product);
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error('Please login to save items'); return; }
    try {
      await api.post(`/auth/wishlist/${product._id}`);
      setWishlisted(!wishlisted);
      toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist');
    } catch { toast.error('Failed to update wishlist'); }
  };

  return (
    <Link
      to={`/products/${product.slug}`}
      className="card-hover group flex flex-col h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
      aria-label={`View ${product.name}`}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3] bg-neutral-100 dark:bg-neutral-800">
        {!imgLoaded && <div className="absolute inset-0 skeleton" />}
        <img
          src={product.images?.[0]}
          alt={product.name}
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="badge bg-red-500 text-white text-[11px] font-bold shadow-sm">-{discount}%</span>
          )}
          {product.isNew && (
            <span className="badge bg-green-500 text-white text-[11px] font-bold shadow-sm">NEW</span>
          )}
          {product.stock === 0 && (
            <span className="badge bg-neutral-700 text-white text-[11px] font-bold shadow-sm">OUT OF STOCK</span>
          )}
        </div>

        {/* Action buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0">
          <button
            onClick={handleWishlist}
            className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-elevated transition-colors
              ${wishlisted ? 'bg-red-500 text-white' : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-red-50 hover:text-red-500'}`}
            aria-label="Add to wishlist"
          >
            <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Quick add overlay */}
        {product.stock > 0 && (
          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleAddToCart}
              className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <ShoppingCart size={15} /> Add to Cart
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        {/* Category */}
        {product.category && (
          <span className="text-xs text-primary-600 dark:text-primary-400 font-medium uppercase tracking-wide">
            {product.category.name}
          </span>
        )}

        {/* Name */}
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-2 leading-snug flex-1">
          {product.name}
        </h3>

        {/* Rating */}
        {product.reviewCount > 0 && (
          <div className="flex items-center gap-1.5">
            <div className="flex">
              {[1,2,3,4,5].map(s => (
                <Star key={s} size={12}
                  className={s <= Math.round(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-neutral-300'}
                />
              ))}
            </div>
            <span className="text-xs text-neutral-500">({product.reviewCount})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mt-auto">
          <span className="price">{formatPrice(product.price)}</span>
          {product.originalPrice > product.price && (
            <span className="price-original">{formatPrice(product.originalPrice)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
