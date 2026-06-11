import { format, formatDistanceToNow, parseISO } from 'date-fns';

export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
};

export const formatDate = (date, fmt = 'MMM d, yyyy') => {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, fmt);
};

export const timeAgo = (date) => {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
};

export const truncate = (str, length = 80) => {
  if (!str) return '';
  return str.length > length ? str.slice(0, length) + '...' : str;
};

export const slugify = (str) => {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

export const getDiscountPercent = (price, originalPrice) => {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
};

export const getStatusColor = (status) => {
  const map = {
    pending: 'warning',
    processing: 'primary',
    shipped: 'primary',
    delivered: 'success',
    cancelled: 'danger',
    refunded: 'neutral',
    paid: 'success',
    failed: 'danger',
    active: 'success',
    inactive: 'danger',
  };
  return map[status] || 'neutral';
};

export const getRatingLabel = (rating) => {
  if (rating >= 4.5) return 'Excellent';
  if (rating >= 4) return 'Very Good';
  if (rating >= 3) return 'Good';
  if (rating >= 2) return 'Fair';
  return 'Poor';
};

export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ');
};

export const classNames = (...classes) => classes.filter(Boolean).join(' ');

export const parseQueryString = (search) => {
  return Object.fromEntries(new URLSearchParams(search));
};

export const buildQueryString = (params) => {
  const filtered = Object.entries(params).filter(([, v]) => v !== '' && v != null && v !== undefined);
  return new URLSearchParams(Object.fromEntries(filtered)).toString();
};
