import { useState } from 'react';
import { Bell, Moon, Sun, Globe, Shield, Trash2 } from 'lucide-react';
import useThemeStore from '../../context/themeStore';
import useAuthStore from '../../context/authStore';
import { Alert } from '../../components/common';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function UserSettings() {
  const { theme, toggleTheme } = useThemeStore();
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState({ orders: true, promotions: true, newsletter: false, security: true });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold font-display">Settings</h1>
        <p className="text-neutral-500 text-sm">Manage your preferences and account settings</p>
      </div>

      {/* Appearance */}
      <div className="card p-6">
        <h2 className="font-semibold mb-5 flex items-center gap-2"><Moon size={18} /> Appearance</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Theme</p>
            <p className="text-xs text-neutral-400">Switch between light and dark mode</p>
          </div>
          <button onClick={toggleTheme} className={`relative w-12 h-6 rounded-full transition-colors ${theme === 'dark' ? 'bg-primary-600' : 'bg-neutral-200'}`}>
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${theme === 'dark' ? 'translate-x-6' : ''}`} />
          </button>
        </div>
        <p className="text-sm text-neutral-500 mt-3">Current: <strong>{theme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}</strong></p>
      </div>

      {/* Notifications */}
      <div className="card p-6">
        <h2 className="font-semibold mb-5 flex items-center gap-2"><Bell size={18} /> Notifications</h2>
        <div className="space-y-4">
          {[
            { key: 'orders', label: 'Order Updates', desc: 'Shipping, delivery and order status emails' },
            { key: 'promotions', label: 'Promotions & Deals', desc: 'Flash sales, coupons and exclusive offers' },
            { key: 'newsletter', label: 'Newsletter', desc: 'Weekly digest and style guides' },
            { key: 'security', label: 'Security Alerts', desc: 'Login attempts and account changes' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between py-1">
              <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-neutral-400">{desc}</p>
              </div>
              <button
                onClick={() => { setNotifications(n => ({ ...n, [key]: !n[key] })); toast.success('Preference saved'); }}
                className={`relative w-10 h-5 rounded-full transition-colors ${notifications[key] ? 'bg-primary-600' : 'bg-neutral-200 dark:bg-neutral-700'}`}
                aria-label={`Toggle ${label}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${notifications[key] ? 'translate-x-5' : ''}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy */}
      <div className="card p-6">
        <h2 className="font-semibold mb-5 flex items-center gap-2"><Shield size={18} /> Privacy & Security</h2>
        <div className="space-y-3 text-sm text-neutral-600 dark:text-neutral-400">
          <p>✅ Your password is encrypted with bcrypt</p>
          <p>✅ All API calls are secured with JWT tokens</p>
          <p>✅ We never share your personal data with third parties</p>
          <p>✅ You can request data deletion at any time</p>
        </div>
      </div>

      {/* Danger zone */}
      <div className="card p-6 border-red-200 dark:border-red-900">
        <h2 className="font-semibold mb-1 text-red-600 flex items-center gap-2"><Trash2 size={18} /> Danger Zone</h2>
        <p className="text-sm text-neutral-500 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
        {!showDeleteConfirm ? (
          <button onClick={() => setShowDeleteConfirm(true)} className="btn btn-danger btn-sm">Delete My Account</button>
        ) : (
          <div className="space-y-3">
            <Alert type="error" title="Are you absolutely sure?" message="This will permanently delete your account, orders, and all data." />
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="btn btn-secondary btn-sm">Cancel</button>
              <button onClick={() => { logout(); navigate('/'); toast.success('Account deleted'); }} className="btn btn-danger btn-sm">
                Yes, Delete Forever
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
