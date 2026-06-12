import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const footerLinks = {
  Shop: [
    { label: 'All Products', to: '/products' },
    { label: 'Electronics', to: '/products?category=electronics' },
    { label: 'Fashion', to: '/products?category=fashion' },
    { label: 'Home & Living', to: '/products?category=home-living' },
    { label: 'Sports & Outdoors', to: '/products?category=sports-outdoors' },
  ],
  Company: [
    { label: 'About Us', to: '/about' },
    { label: 'Blog', to: '/blog' },
    { label: 'Contact', to: '/contact' },
    { label: 'Careers', to: '/about' },
  ],
  Support: [
    { label: 'FAQ', to: '/about#faq' },
    { label: 'Shipping Info', to: '/about#shipping' },
    { label: 'Returns', to: '/about#returns' },
    { label: 'Track Order', to: '/dashboard/orders' },
  ],
};

const socials = [
  { Icon: Facebook, href: 'https://www.facebook.com', label: 'Facebook' },
  { Icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { Icon: Instagram, href: 'https://www.instagram.com', label: 'Instagram' },
  { Icon: Youtube, href: 'https://www.youtube.com', label: 'YouTube' },
];

export default function Footer() {
  return (
    <footer className="bg-neutral-900 dark:bg-neutral-950 text-neutral-400">
      <div className="container-xl py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <span className="text-white font-bold font-display">R</span>
              </div>
              <span className="text-xl font-bold font-display text-white">Revenio</span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-xs">
              Premium e-commerce for the modern shopper. Curated products, fast shipping, hassle-free returns.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2"><Mail size={14} className="text-primary-400" /><span>support@revenio.com</span></div>
              <div className="flex items-center gap-2"><Phone size={14} className="text-primary-400" /><span>+1 (555) 123-4567</span></div>
              <div className="flex items-center gap-2"><MapPin size={14} className="text-primary-400" /><span>100 Commerce St, New York, NY 10001</span></div>
            </div>
            <div className="flex items-center gap-3 mt-6">
              {socials.map(({ Icon, href, label }) => (
                <a key={label} href={href} aria-label={label}
                  className="w-9 h-9 rounded-xl bg-neutral-800 hover:bg-primary-600 flex items-center justify-center transition-colors">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="text-sm font-semibold text-white mb-4">{heading}</h3>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-10 border-t border-neutral-800">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="text-base font-semibold text-white mb-1">Stay in the loop</h3>
              <p className="text-sm">Get the latest deals, launches, and style guides.</p>
            </div>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex gap-2 w-full md:w-auto"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="input bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 flex-1 md:w-64"
                aria-label="Newsletter email"
              />
              <button type="submit" className="btn btn-primary shrink-0">Subscribe</button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} Revenio. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/about#privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/about#terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/about#cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
