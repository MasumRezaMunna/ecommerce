import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, ShieldCheck, UserX, UserCheck } from 'lucide-react';
import api from '../../utils/api';
import { formatDate } from '../../utils/helpers';
import { Badge, Pagination } from '../../components/common';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', page, search, roleFilter],
    queryFn: () => api.get(`/users?page=${page}${search ? `&search=${search}` : ''}${roleFilter ? `&role=${roleFilter}` : ''}`).then(r => r.data.data),
  });

  const toggle = useMutation({
    mutationFn: ({ id, isActive }) => api.patch(`/users/${id}`, { isActive }),
    onSuccess: () => { toast.success('User updated'); qc.invalidateQueries(['admin-users']); },
    onError: () => toast.error('Failed'),
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold font-display">Users</h1>
        <p className="text-neutral-500 text-sm">{data?.pagination?.total || 0} registered users</p>
      </div>

      <div className="card p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input className="input pl-9 text-sm" placeholder="Search by name or email..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <select className="input w-auto text-sm" value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }}>
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="table-container">
        <table className="table">
          <thead><tr><th>User</th><th>Role</th><th>Phone</th><th>Joined</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {isLoading ? Array(8).fill(0).map((_, i) => <tr key={i}><td colSpan={6}><div className="skeleton h-10 rounded" /></td></tr>) :
              data?.users?.map(u => (
                <tr key={u._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <img src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.email}`} alt={u.name} className="w-9 h-9 rounded-full" />
                      <div>
                        <p className="text-sm font-medium">{u.name}</p>
                        <p className="text-xs text-neutral-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <Badge variant={u.role === 'admin' ? 'primary' : 'neutral'}>
                      {u.role === 'admin' && <ShieldCheck size={11} />} {u.role}
                    </Badge>
                  </td>
                  <td><span className="text-sm text-neutral-500">{u.phone || '—'}</span></td>
                  <td><span className="text-xs text-neutral-400">{formatDate(u.createdAt)}</span></td>
                  <td><Badge variant={u.isActive ? 'success' : 'danger'}>{u.isActive ? 'Active' : 'Suspended'}</Badge></td>
                  <td>
                    <button
                      onClick={() => toggle.mutate({ id: u._id, isActive: !u.isActive })}
                      className={`btn btn-sm ${u.isActive ? 'btn-ghost text-red-400 hover:text-red-600' : 'btn-ghost text-green-500 hover:text-green-700'}`}
                      title={u.isActive ? 'Suspend user' : 'Activate user'}
                    >
                      {u.isActive ? <UserX size={14} /> : <UserCheck size={14} />}
                      {u.isActive ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {data?.pagination?.pages > 1 && <Pagination page={data.pagination.page} pages={data.pagination.pages} onPageChange={setPage} />}
    </div>
  );
}
