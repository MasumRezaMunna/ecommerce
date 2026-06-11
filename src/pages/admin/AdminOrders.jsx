// AdminOrders.jsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../utils/api';
import { formatPrice, formatDate, getStatusColor, capitalize } from '../../utils/helpers';
import { Badge, Modal, Spinner, Pagination } from '../../components/common';
import toast from 'react-hot-toast';
import { Eye } from 'lucide-react';

export default function AdminOrders() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', page, statusFilter],
    queryFn: () => api.get(`/orders?page=${page}${statusFilter ? `&status=${statusFilter}` : ''}`).then(r => r.data.data),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) => api.patch(`/orders/${id}/status`, { status }),
    onSuccess: () => { toast.success('Order status updated'); qc.invalidateQueries(['admin-orders']); setSelectedOrder(null); },
    onError: () => toast.error('Update failed'),
  });

  const STATUSES = ['', 'pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display">Orders</h1>
          <p className="text-neutral-500 text-sm">{data?.pagination?.total || 0} total orders</p>
        </div>
        <select className="input w-auto text-sm" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
          <option value="">All Statuses</option>
          {STATUSES.filter(Boolean).map(s => <option key={s} value={s}>{capitalize(s)}</option>)}
        </select>
      </div>

      <div className="table-container">
        <table className="table">
          <thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Payment</th><th>Date</th><th>Action</th></tr></thead>
          <tbody>
            {isLoading ? Array(8).fill(0).map((_, i) => <tr key={i}><td colSpan={8}><div className="skeleton h-10 rounded" /></td></tr>) :
              data?.orders?.map(o => (
                <tr key={o._id}>
                  <td><p className="text-sm font-mono font-medium">{o.orderNumber}</p></td>
                  <td>
                    <div className="flex items-center gap-2">
                      <img src={o.user?.avatar} alt="" className="w-7 h-7 rounded-full" />
                      <div>
                        <p className="text-sm font-medium">{o.user?.name}</p>
                        <p className="text-xs text-neutral-400">{o.user?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td><span className="text-sm">{o.items?.length} item(s)</span></td>
                  <td><span className="font-semibold text-sm">{formatPrice(o.total)}</span></td>
                  <td><Badge variant={getStatusColor(o.status)}>{capitalize(o.status)}</Badge></td>
                  <td><Badge variant={getStatusColor(o.paymentStatus)}>{capitalize(o.paymentStatus)}</Badge></td>
                  <td><span className="text-xs text-neutral-400">{formatDate(o.createdAt)}</span></td>
                  <td>
                    <button onClick={() => { setSelectedOrder(o); setNewStatus(o.status); }} className="btn btn-ghost btn-icon btn-sm">
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {data?.pagination?.pages > 1 && <Pagination page={data.pagination.page} pages={data.pagination.pages} onPageChange={setPage} />}

      <Modal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} title={`Order ${selectedOrder?.orderNumber}`}
        footer={<>
          <button onClick={() => setSelectedOrder(null)} className="btn btn-secondary">Close</button>
          <button onClick={() => updateStatus.mutate({ id: selectedOrder._id, status: newStatus })} disabled={updateStatus.isPending || newStatus === selectedOrder?.status} className="btn btn-primary">
            {updateStatus.isPending ? <Spinner size="sm" /> : 'Update Status'}
          </button>
        </>}
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-3">
                <p className="text-neutral-400 text-xs mb-1">Customer</p>
                <p className="font-medium">{selectedOrder.user?.name}</p>
                <p className="text-neutral-400">{selectedOrder.user?.email}</p>
              </div>
              <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-3">
                <p className="text-neutral-400 text-xs mb-1">Totals</p>
                <p className="font-medium">{formatPrice(selectedOrder.total)}</p>
                <p className="text-neutral-400">{selectedOrder.paymentMethod}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Items ({selectedOrder.items?.length})</p>
              {selectedOrder.items?.map((item, i) => (
                <div key={i} className="flex justify-between text-sm py-1.5 border-b border-neutral-100 dark:border-neutral-800 last:border-0">
                  <span className="text-neutral-600 dark:text-neutral-400">{item.name} ×{item.quantity}</span>
                  <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div>
              <label className="label">Update Status</label>
              <select className="input" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                {STATUSES.filter(Boolean).map(s => <option key={s} value={s}>{capitalize(s)}</option>)}
              </select>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
