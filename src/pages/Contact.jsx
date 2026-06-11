import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import api from '../utils/api';
import { Alert, Spinner } from '../components/common';

export default function Contact() {
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const sendMut = useMutation({
    mutationFn: d => api.post('/contact', d),
    onSuccess: () => { setSuccess(true); reset(); },
    onError: () => {}
  });

  const onSubmit = (data) => sendMut.mutate(data);

  const info = [
    { icon: <Mail size={20} />, label: 'Email', value: 'support@revenio.com', href: 'mailto:support@revenio.com' },
    { icon: <Phone size={20} />, label: 'Phone', value: '+1 (555) 123-4567', href: 'tel:+15551234567' },
    { icon: <MapPin size={20} />, label: 'Address', value: '100 Commerce St, New York, NY 10001' },
    { icon: <Clock size={20} />, label: 'Hours', value: 'Mon–Fri 9am–6pm EST' },
  ];

  return (
    <div className="bg-neutral-50 dark:bg-neutral-950 min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="container-xl text-center">
          <h1 className="text-4xl font-bold font-display mb-3">Get in Touch</h1>
          <p className="text-primary-200 max-w-md mx-auto">Have a question, feedback, or need help? We typically respond within 2–4 hours.</p>
        </div>
      </section>

      <div className="container-xl py-16">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Info cards */}
          <div className="space-y-4">
            {info.map(({ icon, label, value, href }) => (
              <div key={label} className="card p-5 flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
                  {icon}
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-0.5">{label}</p>
                  {href ? (
                    <a href={href} className="text-sm font-medium text-neutral-900 dark:text-neutral-100 hover:text-primary-600 transition-colors">{value}</a>
                  ) : (
                    <p className="text-sm text-neutral-700 dark:text-neutral-300">{value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-2 card p-8">
            <h2 className="text-xl font-bold font-display mb-6">Send us a Message</h2>

            {success && (
              <div className="mb-6">
                <Alert type="success" title="Message sent!" message="Thank you for reaching out. We'll get back to you within 24 hours." />
              </div>
            )}

            {sendMut.isError && (
              <div className="mb-6">
                <Alert type="error" message="Something went wrong. Please try again." />
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="label" htmlFor="name">Your Name <span className="text-red-500">*</span></label>
                  <input id="name" className={`input ${errors.name ? 'input-error' : ''}`}
                    placeholder="Jordan Lee"
                    {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Too short' } })} />
                  {errors.name && <p className="error-msg" role="alert">⚠ {errors.name.message}</p>}
                </div>
                <div>
                  <label className="label" htmlFor="email">Email Address <span className="text-red-500">*</span></label>
                  <input id="email" type="email" className={`input ${errors.email ? 'input-error' : ''}`}
                    placeholder="you@example.com"
                    {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })} />
                  {errors.email && <p className="error-msg" role="alert">⚠ {errors.email.message}</p>}
                </div>
              </div>

              <div>
                <label className="label" htmlFor="subject">Subject <span className="text-red-500">*</span></label>
                <input id="subject" className={`input ${errors.subject ? 'input-error' : ''}`}
                  placeholder="What's this about?"
                  {...register('subject', { required: 'Subject is required', minLength: { value: 5, message: 'Too short' } })} />
                {errors.subject && <p className="error-msg" role="alert">⚠ {errors.subject.message}</p>}
              </div>

              <div>
                <label className="label" htmlFor="message">Message <span className="text-red-500">*</span></label>
                <textarea id="message" rows={5} className={`input resize-none ${errors.message ? 'input-error' : ''}`}
                  placeholder="Tell us how we can help..."
                  {...register('message', { required: 'Message is required', minLength: { value: 20, message: 'Please provide more detail (min 20 characters)' } })} />
                {errors.message && <p className="error-msg" role="alert">⚠ {errors.message.message}</p>}
              </div>

              <button type="submit" disabled={sendMut.isPending} className="btn btn-primary btn-lg w-full sm:w-auto">
                {sendMut.isPending ? <><Spinner size="sm" /> Sending…</> : <><Send size={16} /> Send Message</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
