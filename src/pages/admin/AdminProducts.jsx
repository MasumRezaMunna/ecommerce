import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Search, Eye, Package } from 'lucide-react';
import api from '../../utils/api';
import { formatPrice, formatDate, capitalize } from '../../utils/helpers';
import { Badge, Modal, Spinner, Pagination } from '../../components/common';
import toast from 'react-hot-toast';

function ProductForm({ initial, categories, onSubmit, loading }) {
  const [form, setForm] = useState(initial || {
    name: '', slug: '', description: '', shortDescription: '',
    price: '', originalPrice: '', category: '', brand: '',
    stock: '', images: [''], tags: '', isFeatured: false, isNew: false,
    specifications: [{ key: '', value: '' }]
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category || !form.description) {
      toast.error('Please fill all required fields'); return;
    }
    const slug = form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    onSubmit({
      ...form, slug,
      price: parseFloat(form.price),
      originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : undefined,
      stock: parseInt(form.stock) || 0,
      images: form.images.filter(Boolean),
      tags: typeof form.tags === 'string' ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : form.tags,
      specifications: form.specifications.filter(s => s.key && s.value),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="label">Name <span className="text-red-500">*</span></label>
          <input className="input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Product name" required />
        </div>
        <div>
          <label className="label">Price (USD) <span className="text-red-500">*</span></label>
          <input className="input" type="number" step="0.01" min="0" value={form.price} onChange={e => set('price', e.target.value)} placeholder="0.00" required />
        </div>
        <div>
          <label className="label">Original Price</label>
          <input className="input" type="number" step="0.01" min="0" value={form.originalPrice} onChange={e => set('originalPrice', e.target.value)} placeholder="0.00 (optional)" />
        </div>
        <div>
          <label className="label">Category <span className="text-red-500">*</span></label>
          <select className="input" value={form.category} onChange={e => set('category', e.target.value)} required>
            <option value="">Select category</option>
            {categories?.map(c => <option key={c._id} value={c._id}>{c.icon} {c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Brand</label>
          <input className="input" value={form.brand} onChange={e => set('brand', e.target.value)} placeholder="Brand name" />
        </div>
        <div>
          <label className="label">Stock <span className="text-red-500">*</span></label>
          <input className="input" type="number" min="0" value={form.stock} onChange={e => set('stock', e.target.value)} placeholder="0" required />
        </div>
        <div className="flex items-center gap-4 pt-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="accent-primary-600" checked={form.isFeatured} onChange={e => set('isFeatured', e.target.checked)} />
            <span className="text-sm">Featured</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="accent-primary-600" checked={form.isNew} onChange={e => set('isNew', e.target.checked)} />
            <span className="text-sm">New</span>
          </label>
        </div>
        <div className="col-span-2">
          <label className="label">Short Description</label>
          <input className="input" value={form.shortDescription} onChange={e => set('shortDescription', e.target.value)} placeholder="One-line summary (max 200 chars)" maxLength={200} />
        </div>
        <div className="col-span-2">
          <label className="label">Description <span className="text-red-500">*</span></label>
          <textarea className="input resize-none" rows={3} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Full product description" required />
        </div>
        <div className="col-span-2">
          <label className="label">Image URLs (one per line)</label>
          {form.images.map((img, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input className="input flex-1 text-sm" value={img} onChange={e => {
                const imgs = [...form.images]; imgs[i] = e.target.value; set('images', imgs);
              }} placeholder={`Image URL ${i + 1}`} />
              {i > 0 && <button type="button" onClick={() => set('images', form.images.filter((_, j) => j !== i))} className="btn btn-ghost btn-icon text-red-400"><Trash2 size={14} /></button>}
            </div>
          ))}
          <button type="button" onClick={() => set('images', [...form.images, ''])} className="btn btn-secondary btn-sm">+ Add Image</button>
        </div>
        <div className="col-span-2">
          <label className="label">Tags (comma-separated)</label>
          <input className="input" value={Array.isArray(form.tags) ? form.tags.join(', ') : form.tags} onChange={e => set('tags', e.target.value)} placeholder="electronics, wireless, audio" />
        </div>
        <div className="col-span-2">
          <label className="label">Specifications</label>
          <div className="space-y-2">
            {form.specifications.map((spec, i) => (
              <div key={i} className="flex gap-2">
                <input className="input flex-1 text-sm" value={spec.key} onChange={e => {
                  const specs = [...form.specifications]; specs[i] = { ...specs[i], key: e.target.value }; set('specifications', specs);
                }} placeholder="Key (e.g. Battery Life)" />
                <input className="input flex-1 text-sm" value={spec.value} onChange={e => {
                  const specs = [...form.specifications]; specs[i] = { ...specs[i], value: e.target.value }; set('specifications', specs);
                }} placeholder="Value (e.g. 30 hours)" />
                {i > 0 && <button type="button" onClick={() => set('specifications', form.specifications.filter((_, j) => j !== i))} className="btn btn-ghost btn-icon text-red-400"><Trash2 size={14} /></button>}
              </div>
            ))}
            <button type="button" onClick={() => set('specifications', [...form.specifications, { key: '', value: '' }])} className="btn btn-secondary btn-sm">+ Add Spec</button>
          </div>
        </div>
      </div>
      <button type="submit" disabled={loading} className="btn btn-primary w-full">
        {loading ? <><Spinner size="sm" /> Saving…</> : (initial ? 'Update Product' : 'Create Product')}
      </button>
    </form>
  );
}

export default function AdminProducts() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [modalMode, setModalMode] = useState(null); // 'create' | 'edit'
  const [selected, setSelected] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', page, search],
    queryFn: () => api.get(`/products/admin/all?page=${page}&limit=15${search ? `&search=${search}` : ''}`).then(r => r.data.data),
  });

  const { data: catData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then(r => r.data.data.categories)
  });

  const createMutation = useMutation({
    mutationFn: (d) => api.post('/products', d),
    onSuccess: () => { toast.success('Product created!'); qc.invalidateQueries(['admin-products']); setModalMode(null); },
    onError: (e) => toast.error(e.response?.data?.message || 'Create failed'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/products/${id}`, data),
    onSuccess: () => { toast.success('Product updated!'); qc.invalidateQueries(['admin-products']); setModalMode(null); },
    onError: (e) => toast.error(e.response?.data?.message || 'Update failed'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/products/${id}`),
    onSuccess: () => { toast.success('Product removed'); qc.invalidateQueries(['admin-products']); setDeleteTarget(null); },
    onError: () => toast.error('Delete failed'),
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display">Products</h1>
          <p className="text-neutral-500 text-sm">{data?.pagination?.total || 0} total products</p>
        </div>
        <button onClick={() => { setSelected(null); setModalMode('create'); }} className="btn btn-primary">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="card p-4 flex gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input className="input pl-9 text-sm" placeholder="Search products..." value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? Array(8).fill(0).map((_, i) => (
              <tr key={i}><td colSpan={7}><div className="skeleton h-10 rounded" /></td></tr>
            )) : data?.products?.map(p => (
              <tr key={p._id}>
                <td>
                  <div className="flex items-center gap-3">
                    <img src={p.images?.[0]} alt={p.name} className="w-10 h-10 rounded-xl object-cover border border-neutral-100 dark:border-neutral-700" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate max-w-[200px]">{p.name}</p>
                      <p className="text-xs text-neutral-400">{p.brand}</p>
                    </div>
                  </div>
                </td>
                <td><Badge variant="neutral">{p.category?.name}</Badge></td>
                <td>
                  <div>
                    <p className="font-medium text-sm">{formatPrice(p.price)}</p>
                    {p.originalPrice > p.price && <p className="text-xs text-neutral-400 line-through">{formatPrice(p.originalPrice)}</p>}
                  </div>
                </td>
                <td>
                  <span className={`text-sm font-medium ${p.stock === 0 ? 'text-red-500' : p.stock < 10 ? 'text-amber-500' : 'text-green-600'}`}>
                    {p.stock}
                  </span>
                </td>
                <td><span className="text-sm">⭐ {p.rating} ({p.reviewCount})</span></td>
                <td>
                  <div className="flex flex-col gap-1">
                    {p.isActive ? <Badge variant="success">Active</Badge> : <Badge variant="danger">Inactive</Badge>}
                    {p.isFeatured && <Badge variant="primary">Featured</Badge>}
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-1">
                    <a href={`/products/${p.slug}`} target="_blank" rel="noreferrer" className="btn btn-ghost btn-icon btn-sm" title="View"><Eye size={14} /></a>
                    <button onClick={() => { setSelected(p); setModalMode('edit'); }} className="btn btn-ghost btn-icon btn-sm" title="Edit"><Edit size={14} /></button>
                    <button onClick={() => setDeleteTarget(p)} className="btn btn-ghost btn-icon btn-sm text-red-400 hover:text-red-600" title="Delete"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data?.pagination?.pages > 1 && (
        <Pagination page={data.pagination.page} pages={data.pagination.pages} onPageChange={setPage} />
      )}

      {/* Create/Edit Modal */}
      <Modal isOpen={!!modalMode} onClose={() => setModalMode(null)} title={modalMode === 'create' ? 'Add Product' : 'Edit Product'} size="lg">
        <ProductForm
          initial={modalMode === 'edit' ? { ...selected, tags: selected?.tags?.join(', ') || '', images: selected?.images?.length ? selected.images : [''] } : null}
          categories={catData}
          loading={createMutation.isPending || updateMutation.isPending}
          onSubmit={(d) => {
            if (modalMode === 'create') createMutation.mutate(d);
            else updateMutation.mutate({ id: selected._id, data: d });
          }}
        />
      </Modal>

      {/* Delete confirm */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Remove Product" size="sm"
        footer={<>
          <button onClick={() => setDeleteTarget(null)} className="btn btn-secondary">Cancel</button>
          <button onClick={() => deleteMutation.mutate(deleteTarget._id)} disabled={deleteMutation.isPending} className="btn btn-danger">
            {deleteMutation.isPending ? <Spinner size="sm" /> : 'Remove'}
          </button>
        </>}
      >
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Are you sure you want to remove <strong>{deleteTarget?.name}</strong>? This will hide it from the store.
        </p>
      </Modal>
    </div>
  );
}
