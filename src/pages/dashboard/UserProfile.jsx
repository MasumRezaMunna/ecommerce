import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Camera, Save } from 'lucide-react';
import api from '../../utils/api';
import useAuthStore from '../../context/authStore';
import { Spinner, Alert } from '../../components/common';
import toast from 'react-hot-toast';

export default function UserProfile() {
  const { user, updateUser } = useAuthStore();
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar);
  const qc = useQueryClient();

  const { register, handleSubmit, formState: { errors, isDirty } } = useForm({
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      zip: user?.address?.zip || '',
      country: user?.address?.country || 'US',
    }
  });

  const profileMut = useMutation({
    mutationFn: data => api.put('/auth/update-profile', data),
    onSuccess: res => {
      updateUser(res.data.data.user);
      toast.success('Profile updated!');
      qc.invalidateQueries(['me']);
    },
    onError: e => toast.error(e.response?.data?.message || 'Update failed')
  });

  const onSubmit = (data) => {
    profileMut.mutate({
      name: data.name,
      phone: data.phone,
      avatar: avatarPreview,
      address: { street: data.street, city: data.city, state: data.state, zip: data.zip, country: data.country }
    });
  };

  // Password change
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
  const [pwError, setPwError] = useState('');

  const pwMut = useMutation({
    mutationFn: d => api.put('/auth/change-password', d),
    onSuccess: () => { toast.success('Password changed!'); setPwForm({ current: '', newPw: '', confirm: '' }); setPwError(''); },
    onError: e => setPwError(e.response?.data?.message || 'Failed')
  });

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setPwError('');
    if (pwForm.newPw.length < 8) { setPwError('New password must be at least 8 characters'); return; }
    if (pwForm.newPw !== pwForm.confirm) { setPwError('Passwords do not match'); return; }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(pwForm.newPw)) { setPwError('Must include uppercase, lowercase and number'); return; }
    pwMut.mutate({ currentPassword: pwForm.current, newPassword: pwForm.newPw });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold font-display">Profile</h1>
        <p className="text-neutral-500 text-sm">Manage your personal information</p>
      </div>

      {/* Avatar */}
      <div className="card p-6">
        <h2 className="font-semibold mb-5">Profile Photo</h2>
        <div className="flex items-center gap-5">
          <div className="relative">
            <img src={avatarPreview || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
              alt="Avatar" className="w-20 h-20 rounded-full object-cover ring-4 ring-primary-100 dark:ring-primary-900" />
            <button className="absolute bottom-0 right-0 w-7 h-7 bg-primary-600 rounded-full flex items-center justify-center shadow-md hover:bg-primary-700 transition-colors">
              <Camera size={13} className="text-white" />
            </button>
          </div>
          <div>
            <p className="font-medium text-sm">{user?.name}</p>
            <p className="text-xs text-neutral-400 mb-3">{user?.email}</p>
            <div className="flex gap-2">
              <input
                type="url"
                className="input text-xs py-1.5 px-3 w-56"
                placeholder="Paste avatar URL..."
                value={avatarPreview}
                onChange={e => setAvatarPreview(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <div className="card p-6">
        <h2 className="font-semibold mb-5">Personal Information</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="name">Full Name <span className="text-red-500">*</span></label>
              <input id="name" className={`input ${errors.name ? 'input-error' : ''}`}
                {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Too short' } })} />
              {errors.name && <p className="error-msg">{errors.name.message}</p>}
            </div>
            <div>
              <label className="label" htmlFor="phone">Phone Number</label>
              <input id="phone" className="input" {...register('phone')} placeholder="+1 555 123 4567" />
            </div>
          </div>

          <div className="divider" />
          <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Shipping Address</h3>

          <div>
            <label className="label" htmlFor="street">Street Address</label>
            <input id="street" className="input" {...register('street')} placeholder="123 Main St" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="city">City</label>
              <input id="city" className="input" {...register('city')} />
            </div>
            <div>
              <label className="label" htmlFor="state">State</label>
              <input id="state" className="input" {...register('state')} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="zip">ZIP Code</label>
              <input id="zip" className="input" {...register('zip')} />
            </div>
            <div>
              <label className="label" htmlFor="country">Country</label>
              <select id="country" className="input" {...register('country')}>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="GB">United Kingdom</option>
                <option value="AU">Australia</option>
                <option value="BD">Bangladesh</option>
              </select>
            </div>
          </div>

          <button type="submit" disabled={profileMut.isPending} className="btn btn-primary">
            {profileMut.isPending ? <Spinner size="sm" /> : <><Save size={16} /> Save Changes</>}
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="card p-6">
        <h2 className="font-semibold mb-5">Change Password</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          {pwError && <Alert type="error" message={pwError} />}
          <div>
            <label className="label" htmlFor="current-pw">Current Password <span className="text-red-500">*</span></label>
            <input id="current-pw" type="password" className="input" value={pwForm.current}
              onChange={e => setPwForm(f => ({ ...f, current: e.target.value }))} placeholder="Your current password" required />
          </div>
          <div>
            <label className="label" htmlFor="new-pw">New Password <span className="text-red-500">*</span></label>
            <input id="new-pw" type="password" className="input" value={pwForm.newPw}
              onChange={e => setPwForm(f => ({ ...f, newPw: e.target.value }))} placeholder="At least 8 chars with upper, lower & number" required />
          </div>
          <div>
            <label className="label" htmlFor="confirm-pw">Confirm New Password <span className="text-red-500">*</span></label>
            <input id="confirm-pw" type="password" className="input" value={pwForm.confirm}
              onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))} required />
          </div>
          <button type="submit" disabled={pwMut.isPending} className="btn btn-primary">
            {pwMut.isPending ? <Spinner size="sm" /> : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
