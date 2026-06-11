import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShoppingCart, Heart, Star, ChevronRight, Check, Minus, Plus, Package, Truck, ShieldCheck, ArrowLeft } from 'lucide-react';
import api from '../utils/api';
import { formatPrice, formatDate, timeAgo } from '../utils/helpers';
import { StarRating, Badge, Modal, Spinner, Alert } from '../components/common';
import ProductCard from '../components/products/ProductCard';
import useCartStore from '../context/cartStore';
import useAuthStore from '../context/authStore';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { slug } = useParams();
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const qc = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => api.get(`/products/${slug}`).then(r => r.data.data),
    enabled: !!slug,
  });

  const submitReview = useMutation({
    mutationFn: (payload) => api.post('/reviews', payload),
    onSuccess: () => {
      toast.success('Review submitted!');
      setReviewOpen(false);
      setReviewForm({ rating: 5, title: '', comment: '' });
      qc.invalidateQueries(['product', slug]);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to submit review'),
  });

  if (isLoading) return (
    <div className="container-xl py-16">
      <div className="grid lg:grid-cols-2 gap-12 animate-pulse">
        <div className="space-y-4">
          <div className="skeleton aspect-square w-full rounded-2xl" />
          <div className="flex gap-3">{Array(3).fill(0).map((_,i) => <div key={i} className="skeleton w-20 h-20 rounded-xl" />)}</div>
        </div>
        <div className="space-y-4">
          <div className="skeleton h-6 w-1/3 rounded" />
          <div className="skeleton h-10 w-full rounded" />
          <div className="skeleton h-8 w-1/4 rounded" />
          <div className="skeleton h-24 w-full rounded" />
        </div>
      </div>
    </div>
  );

  if (isError || !data?.product) return (
    <div className="container-xl py-24 text-center">
      <div className="text-5xl mb-4">😕</div>
      <h2 className="text-2xl font-bold mb-2">Product not found</h2>
      <Link to="/products" className="btn btn-primary mt-4">Back to Products</Link>
    </div>
  );

  const { product, related, reviews } = data;
  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-neutral-50 dark:bg-neutral-950 min-h-screen">
      <div className="container-xl py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-8" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link to="/products" className="hover:text-primary-600 transition-colors">Products</Link>
          <ChevronRight size={14} />
          <Link to={`/products?category=${product.category?._id}`} className="hover:text-primary-600 transition-colors">
            {product.category?.name}
          </Link>
          <ChevronRight size={14} />
          <span className="text-neutral-900 dark:text-neutral-100 truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* Main grid */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Image gallery */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 aspect-square">
              <img
                src={product.images[activeImg]}
                alt={product.name}
                className="w-full h-full object-contain p-4 transition-all duration-300"
              />
              {discount > 0 && (
                <div className="absolute top-4 left-4">
                  <Badge variant="danger">-{discount}% OFF</Badge>
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      i === activeImg ? 'border-primary-500 shadow-lg' : 'border-neutral-200 dark:border-neutral-700 opacity-70 hover:opacity-100'
                    }`}
                    aria-label={`Image ${i + 1}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="space-y-6">
            {/* Category & badges */}
            <div className="flex flex-wrap items-center gap-2">
              <Link to={`/products?category=${product.category?._id}`}>
                <Badge variant="primary" style={{ backgroundColor: product.category?.color + '20', color: product.category?.color }}>
                  {product.category?.icon} {product.category?.name}
                </Badge>
              </Link>
              {product.isNew && <Badge variant="success">New</Badge>}
              {product.stock === 0 && <Badge variant="danger">Out of Stock</Badge>}
              {product.stock > 0 && product.stock < 10 && <Badge variant="warning">Only {product.stock} left</Badge>}
            </div>

            {/* Name */}
            <h1 className="text-3xl font-bold font-display leading-tight">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <StarRating rating={product.rating} />
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{product.rating}</span>
              <span className="text-sm text-neutral-400">({product.reviewCount} reviews)</span>
              {product.soldCount > 0 && <span className="text-sm text-neutral-400">· {product.soldCount} sold</span>}
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold font-display text-neutral-900 dark:text-neutral-100">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-xl text-neutral-400 line-through">{formatPrice(product.originalPrice)}</span>
                  <span className="badge bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-sm font-bold">
                    Save {formatPrice(product.originalPrice - product.price)}
                  </span>
                </>
              )}
            </div>

            {/* Short description */}
            {product.shortDescription && (
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">{product.shortDescription}</p>
            )}

            {/* Quantity selector */}
            {product.stock > 0 && (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Quantity:</span>
                <div className="flex items-center border border-neutral-300 dark:border-neutral-600 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 py-2 text-sm font-semibold min-w-[3rem] text-center border-x border-neutral-300 dark:border-neutral-600">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                    className="px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <span className="text-sm text-neutral-400">{product.stock} available</span>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => { if (product.stock > 0) addItem(product, qty); }}
                disabled={product.stock === 0}
                className="btn btn-primary btn-lg flex-1"
              >
                <ShoppingCart size={20} />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button className="btn btn-secondary btn-lg">
                <Heart size={20} /> Wishlist
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { icon: <Truck size={16} />, text: 'Free shipping over $100' },
                { icon: <Package size={16} />, text: '30-day easy returns' },
                { icon: <ShieldCheck size={16} />, text: '2-year warranty' },
              ].map(({ icon, text }) => (
                <div key={text} className="flex flex-col items-center gap-1.5 p-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-center">
                  <span className="text-primary-600 dark:text-primary-400">{icon}</span>
                  <span className="text-xs text-neutral-500 leading-tight">{text}</span>
                </div>
              ))}
            </div>

            {/* Brand */}
            {product.brand && (
              <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 pt-1">
                <span className="font-medium">Brand:</span>
                <Badge variant="neutral">{product.brand}</Badge>
              </div>
            )}
          </div>
        </div>

        {/* Tabs: Description, Specs, Reviews */}
        <ProductTabs product={product} reviews={reviews} onWriteReview={() => {
          if (!isAuthenticated) { toast.error('Please login to write a review'); return; }
          setReviewOpen(true);
        }} />

        {/* Related Products */}
        {related?.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold font-display mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </section>
        )}
      </div>

      {/* Review Modal */}
      <Modal isOpen={reviewOpen} onClose={() => setReviewOpen(false)} title="Write a Review"
        footer={<>
          <button onClick={() => setReviewOpen(false)} className="btn btn-secondary">Cancel</button>
          <button
            onClick={() => submitReview.mutate({ product: product._id, ...reviewForm })}
            disabled={submitReview.isPending || !reviewForm.title || !reviewForm.comment}
            className="btn btn-primary"
          >
            {submitReview.isPending ? <Spinner size="sm" /> : 'Submit Review'}
          </button>
        </>}
      >
        <div className="space-y-4">
          <div>
            <label className="label">Rating</label>
            <StarRating rating={reviewForm.rating} interactive onChange={r => setReviewForm(f => ({ ...f, rating: r }))} size="lg" />
          </div>
          <div>
            <label className="label" htmlFor="review-title">Review Title <span className="text-red-500">*</span></label>
            <input id="review-title" className="input" placeholder="Summarize your experience"
              value={reviewForm.title} onChange={e => setReviewForm(f => ({ ...f, title: e.target.value }))} />
          </div>
          <div>
            <label className="label" htmlFor="review-comment">Your Review <span className="text-red-500">*</span></label>
            <textarea id="review-comment" className="input resize-none" rows={4} placeholder="Share the details of your experience..."
              value={reviewForm.comment} onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))} />
          </div>
        </div>
      </Modal>
    </div>
  );
}

function ProductTabs({ product, reviews, onWriteReview }) {
  const [tab, setTab] = useState('description');
  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'specs', label: 'Specifications' },
    { id: 'reviews', label: `Reviews (${product.reviewCount})` },
  ];

  return (
    <div className="card overflow-visible">
      {/* Tab nav */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-700 px-6 overflow-x-auto">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-5 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              tab === t.id
                ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-6">
        {tab === 'description' && (
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm whitespace-pre-line">{product.description}</p>
          </div>
        )}

        {tab === 'specs' && (
          <div className="overflow-x-auto">
            {product.specifications?.length > 0 ? (
              <table className="w-full text-sm">
                <tbody>
                  {product.specifications.map(({ key, value }, i) => (
                    <tr key={i} className={`${i % 2 === 0 ? 'bg-neutral-50 dark:bg-neutral-800/50' : ''}`}>
                      <td className="py-3 px-4 font-medium text-neutral-700 dark:text-neutral-300 w-48">{key}</td>
                      <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-neutral-400 text-sm">No specifications available.</p>
            )}
          </div>
        )}

        {tab === 'reviews' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-5xl font-bold font-display text-neutral-900 dark:text-neutral-100">{product.rating}</div>
                  <StarRating rating={product.rating} />
                  <p className="text-xs text-neutral-400 mt-1">{product.reviewCount} reviews</p>
                </div>
              </div>
              <button onClick={onWriteReview} className="btn btn-primary">Write a Review</button>
            </div>

            <div className="divider" />

            {reviews?.length === 0 && (
              <div className="text-center py-8 text-neutral-400">
                <Star size={40} className="mx-auto mb-3 opacity-30" />
                <p>No reviews yet. Be the first!</p>
              </div>
            )}

            <div className="space-y-5">
              {reviews?.map(review => (
                <div key={review._id} className="border-b border-neutral-100 dark:border-neutral-800 pb-5 last:border-0">
                  <div className="flex items-start gap-4">
                    <img src={review.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.user?._id}`}
                      alt={review.user?.name} className="w-10 h-10 rounded-full shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-medium text-sm text-neutral-900 dark:text-neutral-100">{review.user?.name}</span>
                        {review.isVerifiedPurchase && <Badge variant="success">✓ Verified Purchase</Badge>}
                        <span className="text-xs text-neutral-400 ml-auto">{timeAgo(review.createdAt)}</span>
                      </div>
                      <StarRating rating={review.rating} size="sm" />
                      <h4 className="font-semibold text-sm mt-2 text-neutral-900 dark:text-neutral-100">{review.title}</h4>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
