import { useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard, Package, Heart, User, Settings, LogOut, Menu, X,
  ShieldCheck, Users, BarChart2, Tag, MessageSquare, FileText, ChevronRight,
  Sun, Moon, Home
} from 'lucide-react';
import useAuthStore from '../../context/authStore';
import useThemeStore from '../../context/themeStore';
import toast from 'react-hot-toast';

const userNav = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/dashboard/orders', label: 'My Orders', icon: Package },
  { to: '/dashboard/wishlist', label: 'Wishlist', icon: Heart },
  { to: '/dashboard/profile', label: 'Profile', icon: User },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
];

const adminNav = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/orders', label: 'Orders', icon: BarChart2 },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/categories', label: 'Categories', icon: Tag },
  { to: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { to: '/admin/blog', label: 'Blog', icon: FileText },
];

export default function DashboardLayout({ role }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  const nav = role === 'admin' ? adminNav : userNav;
  const basePath = role === 'admin' ? '/admin' : '/dashboard';

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-neutral-200 dark:border-neutral-800">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <span className="font-bold font-display text-gradient">Revenio</span>
        </Link>
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden btn-ghost btn-icon">
          <X size={18} />
        </button>
      </div>

      {/* Role badge */}
      <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <img
            src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
            alt={user?.name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-200 dark:ring-primary-800"
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">{user?.name}</p>
            <span className="text-xs inline-flex items-center gap-1 text-primary-600 dark:text-primary-400">
              {role === 'admin' ? <><ShieldCheck size={10} /> Admin</> : <><User size={10} /> Member</>}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {nav.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) => isActive ? 'nav-item-active' : 'nav-item'}
          >
            <Icon size={18} />
            <span>{label}</span>
            <ChevronRight size={14} className="ml-auto opacity-40" />
          </NavLink>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-4 border-t border-neutral-200 dark:border-neutral-800 space-y-1">
        <Link to="/" className="nav-item">
          <Home size={18} />
          <span>Back to Store</span>
        </Link>
        <button onClick={toggleTheme} className="nav-item w-full">
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
        </button>
        <button onClick={handleLogout} className="nav-item w-full text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-neutral-50 dark:bg-neutral-950">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col fixed inset-y-0 left-0 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 bg-white dark:bg-neutral-900 flex flex-col shadow-2xl animate-slide-up">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-4 sm:px-6 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden btn-ghost btn-icon"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <div className="hidden lg:block">
            <h1 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
              {role === 'admin' ? '⚡ Admin Dashboard' : '👋 My Dashboard'}
            </h1>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-neutral-400 hidden sm:block">Hi, {user?.name?.split(' ')[0]}</span>
            <img
              src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
              alt={user?.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-200 dark:ring-primary-800"
            />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
