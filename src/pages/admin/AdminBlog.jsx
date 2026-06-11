import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import api from '../../utils/api';
import { formatDate } from '../../utils/helpers';
import { Badge, Modal, Spinner } from '../../components/common';
import toast from 'react-hot-toast';

function BlogForm({ initial, onSubmit, loading }) {
  const [form, setForm] = useState(initial || {
    title: '', excerpt: '', content: '', category: '', image: '', tags: '', isPublished: false, readTime: 5
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <form onSubmit={e => { e.preventDefault(); if (!form.title || !form.excerpt || !form.content) { toast.error('Fill required fields'); return; } onSubmit({ ...form, tags: typeof form.tags === 'string' ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : form.tags }); }} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
      <div>
        <label className="label">Title <span className="text-red-500">*</span></label>
        <input className="input" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Article title" required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Category</label>
          <input className="input" value={form.category} onChange={e => set('category', e.target.value)} placeholder="e.g. Style Guide" />
        </div>
        <div>
          <label className="label">Read Time (mins)</label>
          <input className="input" type="number" min="1" value={form.readTime} onChange={e => set('readTime', parseInt(e.target.value))} />
        </div>
      </div>
      <div>
        <label className="label">Excerpt <span className="text-red-500">*</span></label>
        <textarea className="input resize-none" rows={2} value={form.excerpt} onChange={e => set('excerpt', e.target.value)} placeholder="Short summary (max 300 chars)" maxLength={300} required />
      </div>
      <div>
        <label className="label">Content <span className="text-red-500">*</span></label>
        <textarea className="input resize-none" rows={6} value={form.content} onChange={e => set('content', e.target.value)} placeholder="Full article content (HTML supported)" required />
      </div>
      <div>
        <label className="label">Cover Image URL</label>
        <input className="input" value={form.image} onChange={e => set('image', e.target.value)} placeholder="https://..." />
      </div>
      <div>
        <label className="label">Tags (comma-separated)</label>
        <input className="input" value={Array.isArray(form.tags) ? form.tags.join(', ') : form.tags} onChange={e => set('tags', e.target.value)} placeholder="fashion, style, tips" />
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" className="accent-primary-600 w-4 h-4" checked={form.isPublished} onChange={e => set('isPublished', e.target.checked)} />
        <span className="text-sm font-medium">Publish immediately</span>
      </label>
      <button type="submit" disabled={loading} className="btn btn-primary w-full">
        {loading ? <Spinner size="sm" /> : (initial ? 'Update Post' : 'Create Post')}
      </button>
    </form>
  );
}

export default function AdminBlog() {
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const qc = useQueryClient();

  const { data } = useQuery({
    queryKey: ['admin-blogs'],
    queryFn: () => api.get('/blog/admin/all').then(r => r.data.data.blogs)
  });

  const createMut = useMutation({ mutationFn: d => api.post('/blog', d), onSuccess: () => { toast.success('Post created!'); qc.invalidateQueries(['admin-blogs']); setModal(null); }, onError: e => toast.error(e.response?.data?.message || 'Failed') });
  const updateMut = useMutation({ mutationFn: ({ id, data }) => api.put(`/blog/${id}`, data), onSuccess: () => { toast.success('Post updated!'); qc.invalidateQueries(['admin-blogs']); setModal(null); }, onError: e => toast.error(e.response?.data?.message || 'Failed') });
  const deleteMut = useMutation({ mutationFn: id => api.delete(`/blog/${id}`), onSuccess: () => { toast.success('Deleted'); qc.invalidateQueries(['admin-blogs']); setDeleteTarget(null); } });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">Blog</h1>
          <p className="text-neutral-500 text-sm">{data?.length || 0} posts</p>
        </div>
        <button onClick={() => { setSelected(null); setModal('create'); }} className="btn btn-primary"><Plus size={16} /> New Post</button>
      </div>

      <div className="table-container">
        <table className="table">
          <thead><tr><th>Title</th><th>Category</th><th>Views</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            {data?.map(post => (
              <tr key={post._id}>
                <td>
                  <div className="flex items-center gap-3">
                    {post.image && <img src={post.image} alt="" className="w-10 h-10 rounded-xl object-cover" />}
                    <div>
                      <p className="text-sm font-medium max-w-[240px] truncate">{post.title}</p>
                      <p className="text-xs text-neutral-400">{post.readTime} min read</p>
                    </div>
                  </div>
                </td>
                <td><Badge variant="neutral">{post.category || '—'}</Badge></td>
                <td><span className="text-sm">{post.views?.toLocaleString() || 0}</span></td>
                <td><Badge variant={post.isPublished ? 'success' : 'neutral'}>{post.isPublished ? 'Published' : 'Draft'}</Badge></td>
                <td><span className="text-xs text-neutral-400">{formatDate(post.createdAt)}</span></td>
                <td>
                  <div className="flex gap-1">
                    <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer" className="btn btn-ghost btn-icon btn-sm"><Eye size={14} /></a>
                    <button onClick={() => { setSelected(post); setModal('edit'); }} className="btn btn-ghost btn-icon btn-sm"><Edit size={14} /></button>
                    <button onClick={() => setDeleteTarget(post)} className="btn btn-ghost btn-icon btn-sm text-red-400"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={!!modal} onClose={() => setModal(null)} title={modal === 'create' ? 'New Blog Post' : 'Edit Post'} size="lg">
        <BlogForm
          initial={modal === 'edit' ? selected : null}
          loading={createMut.isPending || updateMut.isPending}
          onSubmit={d => modal === 'create' ? createMut.mutate(d) : updateMut.mutate({ id: selected._id, data: d })}
        />
      </Modal>

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Post" size="sm"
        footer={<><button onClick={() => setDeleteTarget(null)} className="btn btn-secondary">Cancel</button><button onClick={() => deleteMut.mutate(deleteTarget._id)} className="btn btn-danger">Delete</button></>}>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">Delete <strong>{deleteTarget?.title}</strong>? This is permanent.</p>
      </Modal>
    </div>
  );
}
