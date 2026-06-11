import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../utils/api';
import { formatDate, timeAgo } from '../../utils/helpers';
import { Badge, Modal, Pagination } from '../../components/common';
import toast from 'react-hot-toast';
import { Mail, MailOpen } from 'lucide-react';

export default function AdminMessages() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const qc = useQueryClient();

  const { data } = useQuery({
    queryKey: ['contacts', page, statusFilter],
    queryFn: () => api.get(`/contact?page=${page}${statusFilter ? `&status=${statusFilter}` : ''}`).then(r => r.data.data),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, status }) => api.patch(`/contact/${id}`, { status }),
    onSuccess: () => { toast.success('Updated'); qc.invalidateQueries(['contacts']); },
  });

  const statusColors = { new: 'danger', read: 'warning', replied: 'success', archived: 'neutral' };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">Messages</h1>
          <p className="text-neutral-500 text-sm">{data?.pagination?.total || 0} total messages</p>
        </div>
        <select className="input w-auto text-sm" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
          <option value="">All</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="space-y-3">
        {data?.contacts?.map(c => (
          <div key={c._id} className={`card p-4 cursor-pointer hover:border-primary-300 dark:hover:border-primary-700 transition-colors ${c.status === 'new' ? 'border-primary-200 dark:border-primary-800' : ''}`}
            onClick={() => { setSelected(c); if (c.status === 'new') updateMut.mutate({ id: c._id, status: 'read' }); }}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className={`mt-1 ${c.status === 'new' ? 'text-primary-600' : 'text-neutral-400'}`}>
                  {c.status === 'new' ? <Mail size={16} /> : <MailOpen size={16} />}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">{c.name}</p>
                    <Badge variant={statusColors[c.status]}>{c.status}</Badge>
                  </div>
                  <p className="text-xs text-neutral-400 mb-1">{c.email}</p>
                  <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 truncate">{c.subject}</p>
                  <p className="text-xs text-neutral-400 line-clamp-1 mt-0.5">{c.message}</p>
                </div>
              </div>
              <span className="text-xs text-neutral-400 shrink-0">{timeAgo(c.createdAt)}</span>
            </div>
          </div>
        ))}
      </div>

      {data?.pagination?.pages > 1 && <Pagination page={data.pagination.page} pages={data.pagination.pages} onPageChange={setPage} />}

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={selected?.subject}
        footer={
          <select className="input text-sm w-auto" defaultValue={selected?.status}
            onChange={e => { updateMut.mutate({ id: selected._id, status: e.target.value }); setSelected(s => ({ ...s, status: e.target.value })); }}>
            <option value="new">New</option><option value="read">Read</option><option value="replied">Replied</option><option value="archived">Archived</option>
          </select>
        }>
        {selected && (
          <div className="space-y-4">
            <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-4 text-sm">
              <p><strong>From:</strong> {selected.name} &lt;{selected.email}&gt;</p>
              <p><strong>Date:</strong> {formatDate(selected.createdAt, 'MMM d, yyyy h:mm a')}</p>
            </div>
            <div className="text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap leading-relaxed">
              {selected.message}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
