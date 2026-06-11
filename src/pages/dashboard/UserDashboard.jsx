import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, DollarSign, Package, ArrowRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import api from '../../utils/api';
import useAuthStore from '../../context/authStore';
import { formatPrice, formatDate, getStatusColor, capitalize } from '../../utils/helpers';
import { Badge } from '../../components/common';

const COLORS = ['#0ea5e9','#f97316','#10b981','#8b5cf6','#f43f5e'];

export default function UserDashboard() {
  const { user } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ['user-stats'],
    queryFn: () => api.get('/stats/user').then(r => r.data.data)
  });

  const stats = [
    { label: 'Total Orders', value: data?.totalOrders || 0, icon: ShoppingBag, color: 'text-primary-600', bg: 'bg-primary-50 dark:bg-primary-900/20', link: '/dashboard/orders' },
    { label: 'Total Spent', value: formatPrice(data?.totalSpent || 0), icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20', link: '/dashboard/orders' },
    { label: 'Wishlist Items', value: data?.wishlistCount || 0, icon: Heart, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20', link: '/dashboard/wishlist' },
    { label: 'Delivered', value: data?.ordersByStatus?.find(s => s.status === 'delivered')?.count || 0, icon: Package, color: 'text-accent-600', bg: 'bg-accent-50 dark:bg-accent-900/20', link: '/dashboard/orders' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="card p-6 bg-gradient-to-r from-primary-600 to-primary-700 text-white border-0">
        <div className="flex items-center gap-4">
          <img src={user?.avatar} alt={user?.name} className="w-14 h-14 rounded-full border-2 border-white/30 object-cover" />
          <div>
            <h1 className="text-xl font-bold font-display">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
            <p className="text-primary-200 text-sm">Here's what's happening with your account.</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg, link }) => (
          <Link key={label} to={link} className="card p-5 hover:shadow-strong transition-all group">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${bg} mb-3`}>
              <Icon size={20} className={color} />
            </div>
            <div className="text-2xl font-bold font-display text-neutral-900 dark:text-neutral-100">{isLoading ? '—' : value}</div>
            <div className="text-sm text-neutral-500 mt-0.5">{label}</div>
            <ArrowRight size={14} className={`${color} mt-2 opacity-0 group-hover:opacity-100 transition-opacity`} />
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Recent Orders</h2>
            <Link to="/dashboard/orders" className="text-xs text-primary-600 dark:text-primary-400 font-medium hover:underline">View all</Link>
          </div>
          {data?.recentOrders?.length > 0 ? (
            <div className="space-y-3">
              {data.recentOrders.map(order => (
                <div key={order._id} className="flex items-center justify-between py-2 border-b border-neutral-100 dark:border-neutral-800 last:border-0">
                  <div>
                    <p className="text-sm font-medium font-mono">{order.orderNumber}</p>
                    <p className="text-xs text-neutral-400">{formatDate(order.createdAt)} · {order.items?.length} item(s)</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{formatPrice(order.total)}</p>
                    <Badge variant={getStatusColor(order.status)} className="text-[10px]">{capitalize(order.status)}</Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ShoppingBag size={32} className="mx-auto text-neutral-300 mb-2" />
              <p className="text-sm text-neutral-400">No orders yet</p>
              <Link to="/products" className="btn btn-primary btn-sm mt-3">Start Shopping</Link>
            </div>
          )}
        </div>

        {/* Order status breakdown */}
        <div className="card p-5">
          <h2 className="font-semibold mb-4">Order Breakdown</h2>
          {data?.ordersByStatus?.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={data.ordersByStatus} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={70} label={({ status, percent }) => `${capitalize(status)} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                    {data.ordersByStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v, n) => [v, capitalize(n)]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 mt-2 justify-center">
                {data.ordersByStatus.map((s, i) => (
                  <div key={s.status} className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    {capitalize(s.status)}: {s.count}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-40 text-neutral-400 text-sm">
              No order data yet
            </div>
          )}
        </div>
      </div>

      {/* Quick links */}
      <div className="card p-5">
        <h2 className="font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Browse Products', to: '/products', emoji: '🛍️' },
            { label: 'My Orders', to: '/dashboard/orders', emoji: '📦' },
            { label: 'Wishlist', to: '/dashboard/wishlist', emoji: '❤️' },
            { label: 'Edit Profile', to: '/dashboard/profile', emoji: '👤' },
          ].map(({ label, to, emoji }) => (
            <Link key={to} to={to} className="card p-4 text-center hover:border-primary-300 dark:hover:border-primary-700 transition-colors group">
              <div className="text-2xl mb-2">{emoji}</div>
              <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300 group-hover:text-primary-600 transition-colors">{label}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
