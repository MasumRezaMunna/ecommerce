import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Users, Package, ShoppingCart, DollarSign, MessageSquare, Star } from 'lucide-react';
import api from '../../utils/api';
import { formatPrice, formatDate, getStatusColor, capitalize } from '../../utils/helpers';
import { Badge, SkeletonCard } from '../../components/common';

const COLORS = ['#0ea5e9', '#f97316', '#10b981', '#8b5cf6', '#f43f5e', '#eab308'];

function StatCard({ title, value, sub, icon: Icon, trend, color = 'primary' }) {
  const colors = {
    primary: 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400',
    accent: 'bg-accent-50 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400',
    green: 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    purple: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  };
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${colors[color]}`}>
          <Icon size={20} />
        </div>
        {trend !== undefined && (
          <span className={`flex items-center gap-0.5 text-xs font-semibold ${trend >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="text-2xl font-bold font-display text-neutral-900 dark:text-neutral-100 mb-0.5">{value}</div>
      <div className="text-sm text-neutral-500">{title}</div>
      {sub && <div className="text-xs text-neutral-400 mt-1">{sub}</div>}
    </div>
  );
}

export default function AdminOverview() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => api.get('/stats/admin').then(r => r.data.data),
    refetchInterval: 60000,
  });

  if (isLoading) return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array(8).fill(0).map((_, i) => <div key={i} className="skeleton h-32 rounded-2xl" />)}
      </div>
    </div>
  );

  const { overview, charts, topProducts, recentOrders } = data || {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display">Dashboard Overview</h1>
        <p className="text-neutral-500 text-sm">Real-time business metrics and insights</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value={formatPrice(overview?.totalRevenue || 0)} icon={DollarSign} trend={overview?.revenueGrowth} color="green" sub="All time" />
        <StatCard title="This Month" value={formatPrice(overview?.monthRevenue || 0)} icon={TrendingUp} color="primary" sub={`${overview?.monthOrders || 0} orders`} />
        <StatCard title="Total Users" value={(overview?.totalUsers || 0).toLocaleString()} icon={Users} trend={overview?.userGrowth} color="purple" />
        <StatCard title="Total Products" value={(overview?.totalProducts || 0).toLocaleString()} icon={Package} color="accent" />
        <StatCard title="Total Orders" value={(overview?.totalOrders || 0).toLocaleString()} icon={ShoppingCart} trend={overview?.orderGrowth} color="primary" />
        <StatCard title="Unread Messages" value={overview?.newContacts || 0} icon={MessageSquare} color="accent" sub="Needs attention" />
        <StatCard title="Avg. Rating" value="4.7 ★" icon={Star} color="green" sub="Across all products" />
        <StatCard title="Return Rate" value="2.1%" icon={TrendingDown} color="purple" sub="Below industry avg" />
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue line chart */}
        <div className="card p-5 lg:col-span-2">
          <h3 className="font-semibold mb-4">Revenue & Orders (Last 6 Months)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={charts?.revenueByMonth || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v, n) => n === 'revenue' ? formatPrice(v) : v} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 4 }} name="Revenue" />
              <Line type="monotone" dataKey="orders" stroke="#f97316" strokeWidth={2} dot={{ r: 4 }} name="Orders" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orders by status pie */}
        <div className="card p-5">
          <h3 className="font-semibold mb-4">Orders by Status</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={charts?.ordersByStatus || []} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} label={({ status, percent }) => `${capitalize(status)} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                {(charts?.ordersByStatus || []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v, n) => [v, capitalize(n)]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sales by category bar chart */}
      <div className="card p-5">
        <h3 className="font-semibold mb-4">Sales by Category</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={charts?.salesByCategory || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="category" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
            <Tooltip formatter={(v) => formatPrice(v)} />
            <Bar dataKey="sales" name="Sales" radius={[6, 6, 0, 0]}>
              {(charts?.salesByCategory || []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top products */}
        <div className="card p-5">
          <h3 className="font-semibold mb-4">Top Selling Products</h3>
          <div className="space-y-3">
            {topProducts?.map((p, i) => (
              <div key={p._id} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-xs font-bold text-neutral-500 flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <img src={p.images?.[0]} alt={p.name} className="w-10 h-10 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <p className="text-xs text-neutral-400">{p.soldCount} sold · ⭐ {p.rating}</p>
                </div>
                <span className="text-sm font-semibold text-primary-600">{formatPrice(p.price)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent orders */}
        <div className="card p-5">
          <h3 className="font-semibold mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {recentOrders?.slice(0, 6).map(order => (
              <div key={order._id} className="flex items-center gap-3">
                <img src={order.user?.avatar} alt={order.user?.name} className="w-8 h-8 rounded-full shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{order.user?.name}</p>
                  <p className="text-xs text-neutral-400">{order.orderNumber}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold">{formatPrice(order.total)}</p>
                  <Badge variant={getStatusColor(order.status)} className="text-[10px]">{capitalize(order.status)}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
