import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2 } from 'lucide-react';
import api from '../../utils/api';
import { Modal, Spinner } from '../../components/common';
import toast from 'react-hot-toast';

const ICONS = ['📱','👗','🏠','⚽','📚','💄','🎮','🍕','✈️','🎨','💎','🔧'];
const COLORS = ['#6366f1','#ec4899','#f59e0b','#10b981','#8b5cf6','#f43f5e','#0ea5e9','#84cc16'];

function CatForm({ initial, onSubmit, loading }) {
  const [form, setForm] = useState(initial || { name: '', slug: '', description: '', icon: '📦', color: '#6366f1', image: '' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name) { toast.error('Name required'); return; }
    const slug = form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    onSubmit({ ...form, slug });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">Name <span className="text-red-500">*</span></label>
        <input className="input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Category name" required />
      </div>
      <div>
        <label className="label">Description</label>
        <textarea className="input resize-none" rows={2} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Short description" />
      </div>
      <div>
        <label className="label">Image URL</label>
        <input className="input" value={form.image} onChange={e => set('image', e.target.value)} placeholder="https://..." />
      </div>
      <div>
        <label className="label">Icon</label>
        <div className="flex flex-wrap gap-2">
          {ICONS.map(ic => (
            <button key={ic} type="button" onClick={() => set('icon', ic)}
              className={`w-10 h-10 text-xl rounded-xl transition-all ${form.icon === ic ? 'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900/30' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}>
              {ic}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="label">Color</label>
        <div className="flex flex-wrap gap-2">
          {COLORS.map(c => (
            <button key={c} type="button" onClick={() => set('color', c)}
              className={`w-8 h-8 rounded-xl transition-all ${form.color === c ? 'ring-2 ring-offset-2 ring-neutral-400' : ''}`}
              style={{ backgroundColor: c }} />
          ))}
        </div>
      </div>
      <button type="submit" disabled={loading} className="btn btn-primary w-full">
        {loading ? <Spinner size="sm" /> : (initial ? 'Update Category' : 'Create Category')}
      </button>
    </form>
  );
}

export default function AdminCategories() {
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const qc = useQueryClient();

  const { data } = useQuery({
    queryKey: ['categories-admin'],
    queryFn: () => api.get('/categories').then(r => r.data.data.categories)
  });

  const createMut = useMutation({ mutationFn: d => api.post('/categories', d), onSuccess: () => { toast.success('Created!'); qc.invalidateQueries(['categories-admin']); qc.invalidateQueries(['categories']); setModal(null); }, onError: e => toast.error(e.response?.data?.message || 'Failed') });
  const updateMut = useMutation({ mutationFn: ({ id, data }) => api.put(`/categories/${id}`, data), onSuccess: () => { toast.success('Updated!'); qc.invalidateQueries(['categories-admin']); qc.invalidateQueries(['categories']); setModal(null); }, onError: e => toast.error(e.response?.data?.message || 'Failed') });
  const deleteMut = useMutation({ mutationFn: id => api.delete(`/categories/${id}`), onSuccess: () => { toast.success('Deleted'); qc.invalidateQueries(['categories-admin']); qc.invalidateQueries(['categories']); setDeleteTarget(null); }, onError: e => toast.error(e.response?.data?.message || 'Failed') });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">Categories</h1>
          <p className="text-neutral-500 text-sm">{data?.length || 0} categories</p>
        </div>
        <button onClick={() => { setSelected(null); setModal('create'); }} className="btn btn-primary"><Plus size={16} /> Add Category</button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.map(cat => (
          <div key={cat._id} className="card p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0" style={{ backgroundColor: cat.color + '20' }}>{cat.icon}</div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-neutral-900 dark:text-neutral-100">{cat.name}</p>
              <p className="text-xs text-neutral-400">{cat.productCount || 0} products</p>
            </div>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => { setSelected(cat); setModal('edit'); }} className="btn btn-ghost btn-icon btn-sm"><Edit size={14} /></button>
              <button onClick={() => setDeleteTarget(cat)} className="btn btn-ghost btn-icon btn-sm text-red-400"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={!!modal} onClose={() => setModal(null)} title={modal === 'create' ? 'Add Category' : 'Edit Category'}>
        <CatForm
          initial={modal === 'edit' ? selected : null}
          loading={createMut.isPending || updateMut.isPending}
          onSubmit={d => modal === 'create' ? createMut.mutate(d) : updateMut.mutate({ id: selected._id, data: d })}
        />
      </Modal>

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Category" size="sm"
        footer={<>
          <button onClick={() => setDeleteTarget(null)} className="btn btn-secondary">Cancel</button>
          <button onClick={() => deleteMut.mutate(deleteTarget._id)} disabled={deleteMut.isPending} className="btn btn-danger">Delete</button>
        </>}>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">Delete <strong>{deleteTarget?.name}</strong>? This cannot be undone if it has no products.</p>
      </Modal>
    </div>
  );
}
