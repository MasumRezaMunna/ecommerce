import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Package, XCircle } from 'lucide-react';
import api from '../../utils/api';
import { formatPrice, formatDate, getStatusColor, capitalize } from '../../utils/helpers';
import { Badge, Pagination, Modal, Spinner } from '../../components/common';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function UserOrders() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['my-orders', page, statusFilter],
    queryFn: () => api.get(`/orders/my-orders?page=${page}${statusFilter ? `&status=${statusFilter}` : ''}`).then(r => r.data.data)
  });

  const cancelMut = useMutation({
    mutationFn: id => api.patch(`/orders/${id}/cancel`),
    onSuccess: () => { toast.success('Order cancelled'); qc.invalidateQueries(['my-orders']); setSelected(null); },
    onError: e => toast.error(e.response?.data?.message || 'Cannot cancel')
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display">My Orders</h1>
          <p className="text-neutral-500 text-sm">{data?.pagination?.total || 0} total orders</p>
        </div>
        <select className="input w-auto text-sm" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
          <option value="">All Orders</option>
          {['pending','processing','shipped','delivered','cancelled'].map(s => <option key={s} value={s}>{capitalize(s)}</option>)}
        </select>
      </div>

      {isLoading ? (
        <div className="space-y-3">{Array(5).fill(0).map((_, i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}</div>
      ) : data?.orders?.length === 0 ? (
        <div className="card p-16 text-center">
          <Package size={48} className="mx-auto text-neutral-300 mb-4" />
          <h3 className="font-semibold mb-2">No orders yet</h3>
          <p className="text-neutral-500 text-sm mb-4">When you place orders they'll show up here.</p>
          <Link to="/products" className="btn btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {data?.orders?.map(order => (
            <div key={order._id} className="card p-5 cursor-pointer hover:border-primary-300 dark:hover:border-primary-700 transition-colors" onClick={() => setSelected(order)}>
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-mono font-semibold text-sm">{order.orderNumber}</p>
                  <p className="text-xs text-neutral-400">{formatDate(order.createdAt)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusColor(order.status)}>{capitalize(order.status)}</Badge>
                  <Badge variant={getStatusColor(order.paymentStatus)}>{capitalize(order.paymentStatus)}</Badge>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex -space-x-2">
                  {order.items?.slice(0, 3).map((item, i) => (
                    <img key={i} src={item.image} alt={item.name} className="w-10 h-10 rounded-xl object-cover border-2 border-white dark:border-neutral-800" />
                  ))}
                  {order.items?.length > 3 && (
                    <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 border-2 border-white dark:border-neutral-900 flex items-center justify-center text-xs font-semibold text-neutral-500">
                      +{order.items.length - 3}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 truncate">
                    {order.items?.map(i => i.name).join(', ')}
                  </p>
                </div>
                <p className="font-bold text-primary-600 dark:text-primary-400 shrink-0">{formatPrice(order.total)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {data?.pagination?.pages > 1 && <Pagination page={data.pagination.page} pages={data.pagination.pages} onPageChange={setPage} />}

      {/* Order detail modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={`Order ${selected?.orderNumber}`} size="lg"
        footer={
          selected && ['pending','processing'].includes(selected.status) ? (
            <button onClick={() => cancelMut.mutate(selected._id)} disabled={cancelMut.isPending} className="btn btn-danger">
              {cancelMut.isPending ? <Spinner size="sm" /> : <><XCircle size={15} /> Cancel Order</>}
            </button>
          ) : null
        }
      >
        {selected && (
          <div className="space-y-5">
            {/* Status & dates */}
            <div className="flex flex-wrap gap-2">
              <Badge variant={getStatusColor(selected.status)} className="text-sm px-3 py-1">{capitalize(selected.status)}</Badge>
              <Badge variant={getStatusColor(selected.paymentStatus)} className="text-sm px-3 py-1">{capitalize(selected.paymentStatus)}</Badge>
            </div>

            {/* Items */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Items</h3>
              <div className="space-y-3">
                {selected.items?.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-neutral-400">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                    </div>
                    <p className="font-semibold text-sm">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping */}
            {selected.shippingAddress && (
              <div>
                <h3 className="text-sm font-semibold mb-2">Shipping Address</h3>
                <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-3 text-sm text-neutral-600 dark:text-neutral-400">
                  <p className="font-medium text-neutral-900 dark:text-neutral-100">{selected.shippingAddress.name}</p>
                  <p>{selected.shippingAddress.street}</p>
                  <p>{selected.shippingAddress.city}, {selected.shippingAddress.state} {selected.shippingAddress.zip}</p>
                </div>
              </div>
            )}

            {/* Totals */}
            <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-4 space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-neutral-500">Subtotal</span><span>{formatPrice(selected.subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-neutral-500">Shipping</span><span>{selected.shippingCost === 0 ? 'FREE' : formatPrice(selected.shippingCost)}</span></div>
              <div className="flex justify-between"><span className="text-neutral-500">Tax</span><span>{formatPrice(selected.tax)}</span></div>
              <div className="flex justify-between font-bold text-base border-t border-neutral-200 dark:border-neutral-700 pt-2 mt-1">
                <span>Total</span><span className="text-primary-600">{formatPrice(selected.total)}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
