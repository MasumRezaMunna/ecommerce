import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import useAuthStore from '../../context/authStore';
import toast from 'react-hot-toast';

export default function Register() {
  const [showPass, setShowPass] = useState(false);
  const { register: registerUser, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password');

  const onSubmit = async (data) => {
    const result = await registerUser({ name: data.name, email: data.email, password: data.password, phone: data.phone });
    if (result.success) {
      toast.success('Account created! Welcome to Revenio 🎉');
      navigate('/dashboard');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-accent-500 to-accent-700 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-16 right-16 w-56 h-56 bg-white/5 rounded-full" />
          <div className="absolute bottom-16 left-16 w-40 h-40 bg-white/5 rounded-full" />
        </div>
        <div className="relative z-10 text-white text-center px-12">
          <div className="text-7xl mb-6">🛍️</div>
          <h2 className="text-3xl font-bold font-display mb-4">Join 50,000+ Shoppers</h2>
          <p className="text-accent-100 leading-relaxed mb-8">
            Create your account and unlock exclusive deals, early access to sales, and a personalized shopping experience.
          </p>
          <div className="space-y-3 text-left">
            {[
              '✅ Free shipping on orders over $100',
              '✅ Exclusive member-only deals',
              '✅ Track orders in real time',
              '✅ Hassle-free 30-day returns',
            ].map(f => <p key={f} className="text-sm text-accent-100">{f}</p>)}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-white dark:bg-neutral-950">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="text-xl font-bold font-display text-gradient">Revenio</span>
          </Link>

          <h1 className="text-2xl font-bold font-display mb-1">Create your account</h1>
          <p className="text-neutral-500 text-sm mb-6">Already have an account? <Link to="/login" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">Sign in</Link></p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <label className="label" htmlFor="name">Full Name <span className="text-red-500">*</span></label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input id="name" type="text" className={`input pl-10 ${errors.name ? 'input-error' : ''}`}
                  placeholder="Jordan Lee"
                  {...register('name', {
                    required: 'Full name is required',
                    minLength: { value: 2, message: 'Name must be at least 2 characters' },
                    maxLength: { value: 60, message: 'Name too long' }
                  })} />
              </div>
              {errors.name && <p className="error-msg" role="alert">⚠ {errors.name.message}</p>}
            </div>

            <div>
              <label className="label" htmlFor="email">Email Address <span className="text-red-500">*</span></label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input id="email" type="email" className={`input pl-10 ${errors.email ? 'input-error' : ''}`}
                  placeholder="you@example.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email address' }
                  })} />
              </div>
              {errors.email && <p className="error-msg" role="alert">⚠ {errors.email.message}</p>}
            </div>

            <div>
              <label className="label" htmlFor="phone">Phone Number</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input id="phone" type="tel" className="input pl-10" placeholder="+1 555 123 4567" {...register('phone')} />
              </div>
            </div>

            <div>
              <label className="label" htmlFor="password">Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input id="password" type={showPass ? 'text' : 'password'}
                  className={`input pl-10 pr-10 ${errors.password ? 'input-error' : ''}`}
                  placeholder="Min. 8 chars with upper, lower & number"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 8, message: 'At least 8 characters required' },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message: 'Must include uppercase, lowercase and number'
                    }
                  })} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="error-msg" role="alert">⚠ {errors.password.message}</p>}
            </div>

            <div>
              <label className="label" htmlFor="confirmPassword">Confirm Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input id="confirmPassword" type="password"
                  className={`input pl-10 ${errors.confirmPassword ? 'input-error' : ''}`}
                  placeholder="Re-enter your password"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: val => val === password || 'Passwords do not match'
                  })} />
              </div>
              {errors.confirmPassword && <p className="error-msg" role="alert">⚠ {errors.confirmPassword.message}</p>}
            </div>

            <div className="flex items-start gap-2">
              <input id="terms" type="checkbox" className="mt-0.5 accent-primary-600"
                {...register('terms', { required: 'You must accept the terms' })} />
              <label htmlFor="terms" className="text-xs text-neutral-500 leading-relaxed">
                I agree to the <Link to="/about#terms" className="text-primary-600 hover:underline">Terms of Service</Link> and <Link to="/about#privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>
              </label>
            </div>
            {errors.terms && <p className="error-msg -mt-2" role="alert">⚠ {errors.terms.message}</p>}

            <button type="submit" disabled={isLoading} className="btn btn-primary w-full btn-lg">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Creating account…
                </span>
              ) : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
