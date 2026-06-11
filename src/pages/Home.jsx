import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Headphones, TrendingUp, Star, ChevronRight, Zap } from 'lucide-react';
import api from '../utils/api';
import ProductCard from '../components/products/ProductCard';
import { SkeletonCard } from '../components/common';
import { formatPrice } from '../utils/helpers';
import { useState, useEffect } from 'react';

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const slides = [
    {
      tag: 'New Season Collection',
      heading: 'Elevate Your\nEveryday Life',
      sub: 'Shop premium electronics, fashion & home goods — curated for the modern lifestyle.',
      cta: 'Shop Now',
      link: '/products',
      bg: 'from-primary-950 via-primary-900 to-neutral-900',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&h=700&fit=crop',
      accent: 'New Arrivals',
    },
    {
      tag: 'Tech Deals',
      heading: 'Next-Gen\nElectronics',
      sub: 'From noise-cancelling headphones to 4K OLED monitors — the best gear, better prices.',
      cta: 'Explore Tech',
      link: '/products?category=electronics',
      bg: 'from-neutral-950 via-primary-950 to-neutral-900',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=900&h=700&fit=crop',
      accent: 'Up to 25% Off',
    },
    {
      tag: 'Style Forward',
      heading: 'Dress for the\nLife You Want',
      sub: 'Handcrafted leather goods, premium Merino wool, and timeless silhouettes.',
      cta: 'Shop Fashion',
      link: '/products?category=fashion',
      bg: 'from-accent-950 via-neutral-950 to-neutral-900',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=900&h=700&fit=crop',
      accent: 'Free Shipping',
    },
  ];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, []);

  const slide = slides[current];

  return (
    <section className={`relative min-h-[65vh] flex items-center bg-gradient-to-br ${slide.bg} transition-all duration-700 overflow-hidden`}
      aria-label="Hero section">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={slide.image} alt="" className="w-full h-full object-cover opacity-20 transition-all duration-700" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      </div>

      <div className="container-xl relative z-10 py-20">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <Zap size={14} className="text-accent-400" />
            <span className="text-sm text-white/90 font-medium">{slide.tag}</span>
            <span className="badge bg-accent-500 text-white text-[10px] font-bold">{slide.accent}</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-display text-white leading-tight mb-6 whitespace-pre-line">
            {slide.heading}
          </h1>
          <p className="text-lg text-white/75 mb-8 max-w-lg leading-relaxed">{slide.sub}</p>

          <div className="flex flex-wrap gap-4">
            <Link to={slide.link} className="btn btn-accent btn-lg">
              {slide.cta} <ArrowRight size={18} />
            </Link>
            <Link to="/products" className="btn border-2 border-white/30 text-white hover:bg-white/10 btn-lg backdrop-blur-sm">
              View All Products
            </Link>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all ${i === current ? 'bg-white w-8' : 'bg-white/40 w-4'}`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

// ─── Trust Badges ─────────────────────────────────────────────────────────────
function TrustBadges() {
  const items = [
    { icon: <Truck size={24} />, title: 'Free Shipping', sub: 'On orders over $100' },
    { icon: <RefreshCw size={24} />, title: '30-Day Returns', sub: 'Hassle-free returns' },
    { icon: <ShieldCheck size={24} />, title: 'Secure Payments', sub: 'SSL encrypted checkout' },
    { icon: <Headphones size={24} />, title: '24/7 Support', sub: 'Always here to help' },
  ];
  return (
    <section className="bg-white dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800">
      <div className="container-xl py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map(({ icon, title, sub }) => (
            <div key={title} className="flex items-center gap-4 group">
              <div className="w-11 h-11 rounded-xl bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                {icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{title}</p>
                <p className="text-xs text-neutral-500">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Categories ───────────────────────────────────────────────────────────────
function Categories() {
  const { data } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then(r => r.data.data.categories)
  });

  return (
    <section className="section bg-neutral-50 dark:bg-neutral-950">
      <div className="container-xl">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-primary-600 dark:text-primary-400 text-sm font-semibold uppercase tracking-widest mb-2">Browse</p>
            <h2 className="text-3xl md:text-4xl font-bold font-display">Shop by Category</h2>
          </div>
          <Link to="/products" className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary-600 dark:text-primary-400 hover:gap-2 transition-all">
            All categories <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {(data || Array(6).fill(null)).map((cat, i) => (
            cat ? (
              <Link
                key={cat._id}
                to={`/products?category=${cat._id}`}
                className="group card-hover p-5 text-center"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: cat.color + '20', border: `2px solid ${cat.color}30` }}
                >
                  {cat.icon}
                </div>
                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{cat.name}</p>
                <p className="text-xs text-neutral-500 mt-0.5">{cat.productCount} items</p>
              </Link>
            ) : (
              <div key={i} className="card p-5 text-center animate-pulse">
                <div className="skeleton w-14 h-14 rounded-2xl mx-auto mb-3" />
                <div className="skeleton h-4 w-16 mx-auto rounded" />
              </div>
            )
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Featured Products ────────────────────────────────────────────────────────
function FeaturedProducts() {
  const { data, isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => api.get('/products/featured').then(r => r.data.data.products)
  });

  return (
    <section className="section bg-white dark:bg-neutral-900">
      <div className="container-xl">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-accent-500 text-sm font-semibold uppercase tracking-widest mb-2">Handpicked</p>
            <h2 className="text-3xl md:text-4xl font-bold font-display">Featured Products</h2>
          </div>
          <Link to="/products?isFeatured=true" className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary-600 dark:text-primary-400 hover:gap-2 transition-all">
            View all <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : data?.slice(0, 8).map(p => <ProductCard key={p._id} product={p} />)
          }
        </div>
      </div>
    </section>
  );
}

// ─── Stats ────────────────────────────────────────────────────────────────────
function Stats() {
  const stats = [
    { value: '50K+', label: 'Happy Customers', icon: '😊' },
    { value: '1,200+', label: 'Premium Products', icon: '📦' },
    { value: '99.2%', label: 'Satisfaction Rate', icon: '⭐' },
    { value: '48h', label: 'Avg. Delivery Time', icon: '🚚' },
  ];
  return (
    <section className="bg-gradient-to-br from-primary-600 to-primary-800 py-16">
      <div className="container-xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          {stats.map(({ value, label, icon }) => (
            <div key={label} className="group">
              <div className="text-4xl mb-2">{icon}</div>
              <div className="text-4xl font-bold font-display mb-1 group-hover:scale-105 transition-transform">{value}</div>
              <div className="text-primary-200 text-sm">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── New Arrivals ─────────────────────────────────────────────────────────────
function NewArrivals() {
  const { data, isLoading } = useQuery({
    queryKey: ['new-arrivals'],
    queryFn: () => api.get('/products?isNew=true&limit=4').then(r => r.data.data.products)
  });

  return (
    <section className="section bg-neutral-50 dark:bg-neutral-950">
      <div className="container-xl">
        <div className="text-center mb-10">
          <p className="text-green-600 dark:text-green-400 text-sm font-semibold uppercase tracking-widest mb-2">Fresh in</p>
          <h2 className="text-3xl md:text-4xl font-bold font-display">New Arrivals</h2>
          <p className="text-neutral-500 mt-2 max-w-md mx-auto">The latest additions to our curated catalog, just landed.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : data?.map(p => <ProductCard key={p._id} product={p} />)
          }
        </div>
      </div>
    </section>
  );
}

// ─── Banner CTA ───────────────────────────────────────────────────────────────
function BannerCTA() {
  return (
    <section className="section-sm bg-white dark:bg-neutral-900">
      <div className="container-xl">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 p-8 flex flex-col justify-between min-h-[220px]">
            <div className="absolute right-0 top-0 w-48 h-48 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
            <div className="relative z-10">
              <span className="badge bg-white/20 text-white mb-3">Electronics Sale</span>
              <h3 className="text-2xl font-bold font-display text-white mb-2">Up to 25% Off<br/>Smart Gadgets</h3>
              <p className="text-primary-200 text-sm mb-4">Limited time offer on our top tech picks.</p>
              <Link to="/products?category=electronics" className="btn bg-white text-primary-600 hover:bg-primary-50 btn-sm">Shop Electronics</Link>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent-500 to-accent-700 p-8 flex flex-col justify-between min-h-[220px]">
            <div className="absolute right-0 bottom-0 w-48 h-48 bg-white/10 rounded-full translate-y-16 translate-x-16" />
            <div className="relative z-10">
              <span className="badge bg-white/20 text-white mb-3">Style Edit</span>
              <h3 className="text-2xl font-bold font-display text-white mb-2">New Season<br/>Fashion Picks</h3>
              <p className="text-accent-100 text-sm mb-4">Capsule wardrobe essentials, curated for you.</p>
              <Link to="/products?category=fashion" className="btn bg-white text-accent-600 hover:bg-accent-50 btn-sm">Shop Fashion</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
function Testimonials() {
  const testimonials = [
    { name: 'Sarah Johnson', role: 'Verified Buyer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah', rating: 5, text: "Ordered the Merino sweater and it arrived in 2 days, perfectly packaged. The quality is even better in person. My go-to store now." },
    { name: 'Marcus Lee', role: 'Verified Buyer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marcus', rating: 5, text: "The ergonomic chair completely changed my WFH setup. My back pain is gone after 3 weeks. Worth every penny and customer service was stellar." },
    { name: 'Priya Patel', role: 'Verified Buyer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya', rating: 5, text: "Finally a store that doesn't compromise on quality. The noise-cancelling headphones are insane — I use them every single day." },
    { name: 'James Torres', role: 'Verified Buyer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james', rating: 4, text: "Fast delivery, honest product descriptions, and an easy returns process when I needed to exchange a size. Revenio is my first stop for anything now." },
  ];
  return (
    <section className="section bg-white dark:bg-neutral-900">
      <div className="container-xl">
        <div className="text-center mb-12">
          <p className="text-amber-500 text-sm font-semibold uppercase tracking-widest mb-2">What people say</p>
          <h2 className="text-3xl md:text-4xl font-bold font-display">Customer Reviews</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map(({ name, role, avatar, rating, text }) => (
            <div key={name} className="card p-6 flex flex-col gap-4">
              <div className="flex">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={14} className={s <= rating ? 'text-amber-400 fill-amber-400' : 'text-neutral-300'} />
                ))}
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed flex-1">"{text}"</p>
              <div className="flex items-center gap-3">
                <img src={avatar} alt={name} className="w-9 h-9 rounded-full" />
                <div>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{name}</p>
                  <p className="text-xs text-neutral-400">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Blog Preview ─────────────────────────────────────────────────────────────
function BlogPreview() {
  const { data } = useQuery({
    queryKey: ['blog-preview'],
    queryFn: () => api.get('/blog?limit=3').then(r => r.data.data.blogs)
  });

  return (
    <section className="section bg-neutral-50 dark:bg-neutral-950">
      <div className="container-xl">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-primary-600 dark:text-primary-400 text-sm font-semibold uppercase tracking-widest mb-2">From the blog</p>
            <h2 className="text-3xl md:text-4xl font-bold font-display">Latest Articles</h2>
          </div>
          <Link to="/blog" className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary-600 dark:text-primary-400 hover:gap-2 transition-all">
            All articles <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(data || Array(3).fill(null)).map((post, i) => (
            post ? (
              <Link key={post._id} to={`/blog/${post.slug}`} className="card-hover group overflow-hidden">
                <div className="aspect-video overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                </div>
                <div className="p-5">
                  <span className="badge-primary text-xs mb-2 inline-block">{post.category}</span>
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-neutral-500 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center gap-2 mt-4 text-xs text-neutral-400">
                    <img src={post.author?.avatar} alt={post.author?.name} className="w-5 h-5 rounded-full" />
                    <span>{post.author?.name}</span>
                    <span>·</span>
                    <span>{post.readTime} min read</span>
                  </div>
                </div>
              </Link>
            ) : (
              <div key={i} className="card animate-pulse">
                <div className="skeleton aspect-video w-full rounded-none" />
                <div className="p-5 space-y-3">
                  <div className="skeleton h-3 w-20 rounded" />
                  <div className="skeleton h-4 w-full rounded" />
                  <div className="skeleton h-3 w-5/6 rounded" />
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Newsletter ───────────────────────────────────────────────────────────────
function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };
  return (
    <section className="section bg-gradient-to-br from-primary-900 via-primary-800 to-neutral-900">
      <div className="container-xl">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-5xl mb-4">📬</div>
          <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-3">Get exclusive deals first</h2>
          <p className="text-primary-200 mb-8">Join 50,000+ subscribers and never miss a sale, new arrival, or style guide.</p>
          {submitted ? (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-3xl mb-2">🎉</div>
              <p className="text-white font-semibold">You're in! Check your inbox for a welcome gift.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="input flex-1 bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:ring-white/50"
                required
                aria-label="Email for newsletter"
              />
              <button type="submit" className="btn btn-accent shrink-0">Subscribe Free</button>
            </form>
          )}
          <p className="text-primary-300 text-xs mt-4">No spam. Unsubscribe at any time.</p>
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { step: '01', title: 'Browse & Discover', desc: 'Explore thousands of curated products across 6+ categories with smart filters.', icon: '🔍' },
    { step: '02', title: 'Add to Cart', desc: 'Build your cart, apply promo codes, and preview your order summary in real time.', icon: '🛒' },
    { step: '03', title: 'Secure Checkout', desc: 'Pay safely with card, PayPal, or cash on delivery — SSL encrypted end-to-end.', icon: '🔒' },
    { step: '04', title: 'Fast Delivery', desc: 'Your order ships within 24 hours. Track it live from our dashboard.', icon: '📦' },
  ];
  return (
    <section className="section bg-white dark:bg-neutral-900">
      <div className="container-xl">
        <div className="text-center mb-12">
          <p className="text-primary-600 dark:text-primary-400 text-sm font-semibold uppercase tracking-widest mb-2">Simple process</p>
          <h2 className="text-3xl md:text-4xl font-bold font-display">How It Works</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map(({ step, title, desc, icon }, i) => (
            <div key={step} className="relative card p-6 text-center group hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-2xl mx-auto mb-4 group-hover:scale-110 transition-transform">
                {icon}
              </div>
              <span className="absolute top-4 right-4 text-xs font-bold text-neutral-200 dark:text-neutral-700 font-display">{step}</span>
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">{title}</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">{desc}</p>
              {i < steps.length - 1 && (
                <ArrowRight className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 text-neutral-200 dark:text-neutral-700 z-10" size={20} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Partners ─────────────────────────────────────────────────────────────────
function Partners() {
  const brands = ['SoundCore', 'TechWrist', 'ViewPro', 'WoolCraft', 'ErgoSit', 'DermaClear', 'VeloPro', 'YogaFlow'];
  return (
    <section className="py-12 bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-100 dark:border-neutral-800">
      <div className="container-xl">
        <p className="text-center text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-8">Trusted brands on Revenio</p>
        <div className="flex flex-wrap justify-center items-center gap-6 lg:gap-10">
          {brands.map(b => (
            <div key={b} className="px-6 py-3 bg-white dark:bg-neutral-800 rounded-xl shadow-card border border-neutral-100 dark:border-neutral-700">
              <span className="text-sm font-bold text-neutral-500 dark:text-neutral-400 tracking-wide">{b}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBadges />
      <Categories />
      <FeaturedProducts />
      <Stats />
      <BannerCTA />
      <NewArrivals />
      <HowItWorks />
      <Testimonials />
      <BlogPreview />
      <Partners />
      <Newsletter />
    </>
  );
}
