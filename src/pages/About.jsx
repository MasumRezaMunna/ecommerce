import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RefreshCw, Headphones, Users, Package, Star, Award } from 'lucide-react';

export default function About() {
  const team = [
    { name: 'Alex Morgan', role: 'CEO & Founder', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex', bio: '10+ years in e-commerce and product strategy.' },
    { name: 'Priya Sharma', role: 'Head of Design', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya', bio: 'Former designer at top retail brands worldwide.' },
    { name: 'Marcus Chen', role: 'CTO', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marcus', bio: 'Full-stack engineer passionate about performance.' },
    { name: 'Sarah Kim', role: 'Head of Operations', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarahk', bio: 'Supply chain and logistics expert since 2015.' },
  ];

  const values = [
    { icon: '🎯', title: 'Quality First', desc: 'Every product on Revenio is hand-curated. We only list what we\'d buy ourselves.' },
    { icon: '🤝', title: 'Customer Obsessed', desc: 'Your satisfaction is our north star. We go above and beyond to make things right.' },
    { icon: '🌍', title: 'Sustainably Minded', desc: 'We prioritize brands that care about people and the planet.' },
    { icon: '⚡', title: 'Relentlessly Improving', desc: 'We ship updates, add features, and listen to feedback every single week.' },
  ];

  const faqs = [
    { q: 'How long does shipping take?', a: 'Standard shipping takes 3–7 business days. Express (1–2 days) is available at checkout. Orders over $100 ship free.' },
    { q: 'What is your return policy?', a: 'We offer hassle-free 30-day returns on all items. Simply initiate a return from your dashboard and we\'ll arrange pickup.' },
    { q: 'Are products authentic?', a: 'Absolutely. We only work with verified sellers and authorized distributors. Every product comes with a certificate of authenticity where applicable.' },
    { q: 'How do I track my order?', a: 'Once shipped, you\'ll receive an email with a tracking number. You can also track from your dashboard under "My Orders".' },
    { q: 'Do you ship internationally?', a: 'Currently we ship to the US, Canada, UK, Australia, and Bangladesh. More countries coming soon.' },
    { q: 'Is my payment information secure?', a: 'Yes. All payments are processed through Stripe with 256-bit SSL encryption. We never store your card details.' },
  ];

  return (
    <div className="bg-neutral-50 dark:bg-neutral-950">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-700 to-primary-900 text-white py-24">
        <div className="container-xl text-center">
          <span className="badge bg-white/20 text-white text-sm mb-4">Our Story</span>
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">Built for the Modern Shopper</h1>
          <p className="text-primary-200 max-w-xl mx-auto text-lg leading-relaxed">
            Revenio was founded in 2022 with a simple belief: shopping online should be delightful — not stressful. We built the platform we always wished existed.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="section-sm bg-white dark:bg-neutral-900">
        <div className="container-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '50K+', label: 'Happy Customers', icon: <Users size={20} /> },
              { value: '1,200+', label: 'Products Listed', icon: <Package size={20} /> },
              { value: '4.8★', label: 'Average Rating', icon: <Star size={20} /> },
              { value: '3 Years', label: 'In Business', icon: <Award size={20} /> },
            ].map(({ value, label, icon }) => (
              <div key={label} className="group">
                <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  {icon}
                </div>
                <div className="text-3xl font-bold font-display mb-1">{value}</div>
                <div className="text-sm text-neutral-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-neutral-50 dark:bg-neutral-950">
        <div className="container-xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display mb-2">Our Values</h2>
            <p className="text-neutral-500">The principles that guide every decision we make.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon, title, desc }) => (
              <div key={title} className="card p-6 text-center group hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{icon}</div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section bg-white dark:bg-neutral-900">
        <div className="container-xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display mb-2">Meet the Team</h2>
            <p className="text-neutral-500">The people behind Revenio.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map(({ name, role, avatar, bio }) => (
              <div key={name} className="card p-6 text-center group">
                <img src={avatar} alt={name} className="w-20 h-20 rounded-full mx-auto mb-3 ring-4 ring-primary-100 dark:ring-primary-900 group-hover:scale-105 transition-transform" />
                <h3 className="font-semibold">{name}</h3>
                <p className="text-xs text-primary-600 dark:text-primary-400 font-medium mb-2">{role}</p>
                <p className="text-xs text-neutral-500 leading-relaxed">{bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="section bg-neutral-50 dark:bg-neutral-950">
        <div className="container-xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display mb-2">Why Shop With Us?</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Truck size={24} />, title: 'Fast Shipping', desc: 'Orders ship within 24h, delivered in 3–7 days' },
              { icon: <RefreshCw size={24} />, title: '30-Day Returns', desc: 'Not happy? Return it, no questions asked' },
              { icon: <ShieldCheck size={24} />, title: 'Secure Checkout', desc: 'SSL encryption on every transaction' },
              { icon: <Headphones size={24} />, title: '24/7 Support', desc: 'Real humans, always available to help' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="card p-5 flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-primary-50 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center shrink-0">{icon}</div>
                <div>
                  <h3 className="font-semibold text-sm">{title}</h3>
                  <p className="text-xs text-neutral-500 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section bg-white dark:bg-neutral-900">
        <div className="container-xl max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display mb-2">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map(({ q, a }) => (
              <details key={q} className="card p-5 group">
                <summary className="text-sm font-semibold cursor-pointer list-none flex items-center justify-between">
                  {q}
                  <span className="text-neutral-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-sm text-neutral-500 mt-3 leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-gradient-to-br from-primary-600 to-primary-900 text-white text-center">
        <div className="container-xl max-w-xl">
          <h2 className="text-3xl font-bold font-display mb-3">Ready to start shopping?</h2>
          <p className="text-primary-200 mb-8">Join 50,000+ happy customers and discover why Revenio is the internet's favourite shop.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/products" className="btn btn-accent btn-lg">Browse Products</Link>
            <Link to="/register" className="btn border-2 border-white/30 text-white hover:bg-white/10 btn-lg">Create Free Account</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
