// ─── Button ──────────────────────────────────────────────────────────────────
export function Button({ children, variant = 'primary', size = 'md', loading = false, className = '', ...props }) {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    accent: 'btn-accent',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
  };
  const sizes = { sm: 'btn-sm', md: '', lg: 'btn-lg', icon: 'btn-icon' };

  return (
    <button
      className={`btn ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <Spinner size="sm" className="text-current" />}
      {children}
    </button>
  );
}

// ─── Spinner ─────────────────────────────────────────────────────────────────
export function Spinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'w-4 h-4 border-2', md: 'w-6 h-6 border-2', lg: 'w-8 h-8 border-3' };
  return (
    <div className={`${sizes[size]} rounded-full border-current border-t-transparent animate-spin ${className}`} />
  );
}

// ─── Input ───────────────────────────────────────────────────────────────────
export function Input({ label, error, hint, icon, iconRight, className = '', id, required, ...props }) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="label">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">{icon}</span>}
        <input
          id={inputId}
          className={`input ${error ? 'input-error' : ''} ${icon ? 'pl-10' : ''} ${iconRight ? 'pr-10' : ''} ${className}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />
        {iconRight && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">{iconRight}</span>}
      </div>
      {error && <p id={`${inputId}-error`} className="error-msg" role="alert">⚠ {error}</p>}
      {hint && !error && <p id={`${inputId}-hint`} className="text-xs text-neutral-400 mt-1">{hint}</p>}
    </div>
  );
}

// ─── Select ──────────────────────────────────────────────────────────────────
export function Select({ label, error, options = [], className = '', id, required, placeholder, ...props }) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="label">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        id={inputId}
        className={`input ${error ? 'input-error' : ''} ${className}`}
        aria-invalid={!!error}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="error-msg">⚠ {error}</p>}
    </div>
  );
}

// ─── Textarea ────────────────────────────────────────────────────────────────
export function Textarea({ label, error, className = '', id, required, rows = 4, ...props }) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="label">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        id={inputId}
        rows={rows}
        className={`input resize-none ${error ? 'input-error' : ''} ${className}`}
        aria-invalid={!!error}
        {...props}
      />
      {error && <p className="error-msg">⚠ {error}</p>}
    </div>
  );
}

// ─── Badge ───────────────────────────────────────────────────────────────────
export function Badge({ children, variant = 'neutral', className = '' }) {
  const variants = {
    primary: 'badge-primary',
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    neutral: 'badge-neutral',
    accent: 'badge-accent',
  };
  return <span className={`badge ${variants[variant]} ${className}`}>{children}</span>;
}

// ─── Modal ───────────────────────────────────────────────────────────────────
import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export function Modal({ isOpen, onClose, title, children, size = 'md', footer }) {
  const overlayRef = useRef(null);
  const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="modal-overlay"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className={`modal-content ${sizes[size]} w-full`}>
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
            <h3 id="modal-title" className="text-lg font-semibold">{title}</h3>
            <button onClick={onClose} className="btn-ghost btn-icon" aria-label="Close modal">
              <X size={20} />
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
        {footer && (
          <div className="flex justify-end gap-3 px-6 pb-6 pt-0">{footer}</div>
        )}
      </div>
    </div>
  );
}

// ─── StarRating ──────────────────────────────────────────────────────────────
import { Star } from 'lucide-react';

export function StarRating({ rating = 0, max = 5, size = 'sm', interactive = false, onChange }) {
  const sizes = { sm: 14, md: 18, lg: 22 };
  const px = sizes[size];

  return (
    <div className="stars" aria-label={`Rating: ${rating} out of ${max}`}>
      {Array.from({ length: max }, (_, i) => {
        const filled = i + 1 <= rating;
        const half = !filled && i + 0.5 < rating;
        return (
          <Star
            key={i}
            size={px}
            onClick={() => interactive && onChange?.(i + 1)}
            className={`transition-colors ${interactive ? 'cursor-pointer hover:scale-110' : ''} ${
              filled ? 'text-amber-400 fill-amber-400' :
              half ? 'text-amber-400 fill-amber-200' :
              'text-neutral-300 dark:text-neutral-600'
            }`}
          />
        );
      })}
    </div>
  );
}

// ─── Pagination ──────────────────────────────────────────────────────────────
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null;

  const getPages = () => {
    const arr = [];
    if (pages <= 7) {
      for (let i = 1; i <= pages; i++) arr.push(i);
    } else {
      arr.push(1);
      if (page > 3) arr.push('...');
      for (let i = Math.max(2, page - 1); i <= Math.min(pages - 1, page + 1); i++) arr.push(i);
      if (page < pages - 2) arr.push('...');
      arr.push(pages);
    }
    return arr;
  };

  return (
    <nav className="flex items-center justify-center gap-1" aria-label="Pagination">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="btn btn-secondary btn-sm btn-icon"
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>
      {getPages().map((p, i) => (
        p === '...'
          ? <span key={`dots-${i}`} className="px-2 text-neutral-400">…</span>
          : <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`btn btn-sm w-9 ${p === page ? 'btn-primary' : 'btn-secondary'}`}
              aria-current={p === page ? 'page' : undefined}
            >{p}</button>
      ))}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
        className="btn btn-secondary btn-sm btn-icon"
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}

// ─── SkeletonCard ─────────────────────────────────────────────────────────────
export function SkeletonCard() {
  return (
    <div className="card p-0 overflow-hidden animate-pulse">
      <div className="skeleton h-52 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-3 w-5/6 rounded" />
        <div className="flex justify-between items-center pt-1">
          <div className="skeleton h-5 w-20 rounded" />
          <div className="skeleton h-8 w-24 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// ─── EmptyState ──────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      {icon && <div className="text-5xl mb-4">{icon}</div>}
      <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300 mb-2">{title}</h3>
      {description && <p className="text-neutral-500 dark:text-neutral-500 text-sm max-w-sm mb-6">{description}</p>}
      {action}
    </div>
  );
}

// ─── Dropdown ────────────────────────────────────────────────────────────────
import { useState, useRef as useRef2 } from 'react';

export function Dropdown({ trigger, items = [], align = 'right' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef2(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const alignClass = align === 'right' ? 'right-0' : 'left-0';

  return (
    <div ref={ref} className="relative inline-block">
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div className={`absolute ${alignClass} top-full mt-2 w-48 card shadow-strong py-1 z-50 animate-slide-down`}>
          {items.map((item, i) => (
            item.divider
              ? <div key={i} className="my-1 border-t border-neutral-100 dark:border-neutral-800" />
              : <button
                  key={i}
                  onClick={() => { item.onClick?.(); setOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors
                    ${item.danger
                      ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                    }`}
                >
                  {item.icon && <span className="text-neutral-400">{item.icon}</span>}
                  {item.label}
                </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Alert ───────────────────────────────────────────────────────────────────
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

export function Alert({ type = 'info', title, message, onClose }) {
  const styles = {
    info: { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800', text: 'text-blue-800 dark:text-blue-200', icon: <Info size={18} /> },
    success: { bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800', text: 'text-green-800 dark:text-green-200', icon: <CheckCircle size={18} /> },
    warning: { bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800', text: 'text-amber-800 dark:text-amber-200', icon: <AlertTriangle size={18} /> },
    error: { bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800', text: 'text-red-800 dark:text-red-200', icon: <AlertCircle size={18} /> },
  };
  const s = styles[type];

  return (
    <div className={`flex gap-3 p-4 rounded-xl border ${s.bg} ${s.border} ${s.text}`} role="alert">
      <span className="shrink-0 mt-0.5">{s.icon}</span>
      <div className="flex-1 min-w-0">
        {title && <p className="font-medium">{title}</p>}
        {message && <p className="text-sm mt-0.5 opacity-90">{message}</p>}
      </div>
      {onClose && <button onClick={onClose} className="shrink-0 opacity-60 hover:opacity-100"><X size={16} /></button>}
    </div>
  );
}
