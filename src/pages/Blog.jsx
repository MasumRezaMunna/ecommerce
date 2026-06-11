import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { Calendar, Clock, Eye, Tag, ChevronRight, ArrowLeft } from 'lucide-react';
import api from '../utils/api';
import { formatDate, timeAgo } from '../utils/helpers';
import { Pagination, SkeletonCard } from '../components/common';

// ─── Blog Listing ─────────────────────────────────────────────────────────────
export function Blog() {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['blog', page, category, search],
    queryFn: () => api.get(`/blog?page=${page}${category ? `&category=${encodeURIComponent(category)}` : ''}${search ? `&search=${encodeURIComponent(search)}` : ''}`).then(r => r.data.data)
  });

  const categories = [...new Set((data?.blogs || []).map(b => b.category).filter(Boolean))];

  return (
    <div className="bg-neutral-50 dark:bg-neutral-950 min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-neutral-900 to-primary-900 text-white py-16">
        <div className="container-xl text-center">
          <h1 className="text-4xl font-bold font-display mb-3">Revenio Blog</h1>
          <p className="text-neutral-300 max-w-md mx-auto">Style guides, industry insights, and product deep-dives from our team.</p>
          <form className="flex gap-2 max-w-md mx-auto mt-6" onSubmit={e => { e.preventDefault(); }}>
            <input
              type="search"
              className="input flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-white/30"
              placeholder="Search articles..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
          </form>
        </div>
      </section>

      <div className="container-xl py-12">
        {/* Category filters */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <button onClick={() => setCategory('')} className={`badge text-sm py-1.5 px-4 cursor-pointer ${!category ? 'badge-primary' : 'badge-neutral'}`}>All</button>
            {categories.map(c => (
              <button key={c} onClick={() => { setCategory(c === category ? '' : c); setPage(1); }}
                className={`badge text-sm py-1.5 px-4 cursor-pointer ${category === c ? 'badge-primary' : 'badge-neutral'}`}>{c}</button>
            ))}
          </div>
        )}

        {/* Grid */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.blogs?.map(post => (
                <Link key={post._id} to={`/blog/${post.slug}`} className="card-hover group overflow-hidden">
                  <div className="aspect-video overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                    {post.image ? (
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">📰</div>
                    )}
                  </div>
                  <div className="p-5">
                    {post.category && (
                      <span className="badge-primary text-xs mb-2 inline-flex items-center gap-1"><Tag size={10} />{post.category}</span>
                    )}
                    <h2 className="font-bold text-neutral-900 dark:text-neutral-100 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors leading-snug">{post.title}</h2>
                    <p className="text-sm text-neutral-500 line-clamp-2 mb-4">{post.excerpt}</p>
                    <div className="flex items-center gap-3 text-xs text-neutral-400">
                      <div className="flex items-center gap-1.5">
                        <img src={post.author?.avatar} alt="" className="w-5 h-5 rounded-full" />
                        <span>{post.author?.name}</span>
                      </div>
                      <span>·</span>
                      <span className="flex items-center gap-1"><Calendar size={11} />{formatDate(post.publishedAt || post.createdAt)}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1"><Clock size={11} />{post.readTime}m</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {data?.blogs?.length === 0 && (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">📭</div>
                <h3 className="font-semibold mb-2">No articles found</h3>
                <p className="text-neutral-500 text-sm">Try a different search or category.</p>
              </div>
            )}

            {data?.pagination?.pages > 1 && (
              <div className="mt-10">
                <Pagination page={data.pagination.page} pages={data.pagination.pages} onPageChange={p => { setPage(p); window.scrollTo(0,0); }} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Blog Post Detail ─────────────────────────────────────────────────────────
export function BlogPost() {
  const { slug } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['blog', slug],
    queryFn: () => api.get(`/blog/${slug}`).then(r => r.data.data)
  });

  if (isLoading) return (
    <div className="container-xl py-16 max-w-3xl">
      <div className="animate-pulse space-y-4">
        <div className="skeleton h-8 w-2/3 rounded" />
        <div className="skeleton h-4 w-1/3 rounded" />
        <div className="skeleton aspect-video w-full rounded-2xl" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-5/6 rounded" />
        <div className="skeleton h-4 w-full rounded" />
      </div>
    </div>
  );

  if (isError || !data?.blog) return (
    <div className="container-xl py-24 text-center">
      <div className="text-5xl mb-4">😕</div>
      <h2 className="text-2xl font-bold mb-4">Article not found</h2>
      <Link to="/blog" className="btn btn-primary">Back to Blog</Link>
    </div>
  );

  const { blog, related } = data;

  return (
    <div className="bg-white dark:bg-neutral-950 min-h-screen">
      <div className="container-xl py-10 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-8" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-primary-600">Home</Link>
          <ChevronRight size={14} />
          <Link to="/blog" className="hover:text-primary-600">Blog</Link>
          <ChevronRight size={14} />
          <span className="text-neutral-900 dark:text-neutral-100 truncate max-w-[200px]">{blog.title}</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Article */}
          <article className="lg:col-span-2">
            {blog.category && (
              <span className="badge-primary mb-4 inline-flex items-center gap-1"><Tag size={11} />{blog.category}</span>
            )}
            <h1 className="text-3xl md:text-4xl font-bold font-display leading-tight mb-5">{blog.title}</h1>

            <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center gap-2">
                <img src={blog.author?.avatar} alt={blog.author?.name} className="w-9 h-9 rounded-full" />
                <div>
                  <p className="text-sm font-medium">{blog.author?.name}</p>
                  <p className="text-xs text-neutral-400">{formatDate(blog.publishedAt || blog.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-neutral-400 ml-auto">
                <span className="flex items-center gap-1"><Clock size={12} /> {blog.readTime} min read</span>
                <span className="flex items-center gap-1"><Eye size={12} /> {blog.views?.toLocaleString()} views</span>
              </div>
            </div>

            {blog.image && (
              <img src={blog.image} alt={blog.title} className="w-full rounded-2xl object-cover aspect-video mb-8" />
            )}

            <div
              className="prose prose-neutral dark:prose-invert max-w-none text-neutral-700 dark:text-neutral-300 leading-relaxed [&>p]:mb-4 [&>h2]:font-bold [&>h2]:text-xl [&>h2]:mt-8 [&>h2]:mb-3"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {blog.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-neutral-200 dark:border-neutral-700">
                {blog.tags.map(tag => (
                  <span key={tag} className="badge-neutral">#{tag}</span>
                ))}
              </div>
            )}

            <div className="mt-8">
              <Link to="/blog" className="btn btn-secondary btn-sm">
                <ArrowLeft size={14} /> Back to Blog
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Author card */}
            <div className="card p-5">
              <h3 className="text-sm font-semibold mb-3">About the Author</h3>
              <div className="flex items-center gap-3">
                <img src={blog.author?.avatar} alt={blog.author?.name} className="w-12 h-12 rounded-full" />
                <div>
                  <p className="font-medium text-sm">{blog.author?.name}</p>
                  <p className="text-xs text-neutral-400">Revenio Team</p>
                </div>
              </div>
            </div>

            {/* Related */}
            {related?.length > 0 && (
              <div className="card p-5">
                <h3 className="text-sm font-semibold mb-4">Related Articles</h3>
                <div className="space-y-4">
                  {related.map(post => (
                    <Link key={post._id} to={`/blog/${post.slug}`} className="flex gap-3 group">
                      {post.image && (
                        <img src={post.image} alt="" className="w-16 h-12 rounded-xl object-cover shrink-0" />
                      )}
                      <div>
                        <p className="text-sm font-medium line-clamp-2 group-hover:text-primary-600 transition-colors leading-snug">{post.title}</p>
                        <p className="text-xs text-neutral-400 mt-1">{post.readTime} min read</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Blog;
