import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/home', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setLoading(true);

    try {
      await register({
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
      });
      navigate('/home');
    } catch (err) {
      const validationErrors = err.response?.data?.errors || [];
      if (validationErrors.length > 0) {
        setFieldErrors(
          validationErrors.reduce((acc, item) => {
            acc[item.field] = item.message;
            return acc;
          }, {})
        );
      }

      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16">
      <div className="max-w-6xl w-full grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="hidden lg:flex flex-col justify-center rounded-[32px] bg-gradient-to-br from-plum-900 via-slate-950 to-indigo-950 p-14 text-white shadow-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300 mb-4">Create your account</p>
          <h1 className="font-display text-4xl font-bold leading-tight">Start shopping with confidence.</h1>
          <p className="mt-5 max-w-md text-sm leading-7 text-stone-200">
            Join Market Yard for personalized recommendations, faster checkout, and a secure account protected by industry-standard bcrypt password hashing.
          </p>
          <div className="mt-10 grid gap-4">
            <div className="rounded-[24px] border border-white/10 bg-white/10 p-5">
              <p className="text-sm font-semibold text-white">Auto-generated User ID</p>
              <p className="text-sm text-stone-200 mt-1">We create a unique User ID for fast login alternatives.</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/10 p-5">
              <p className="text-sm font-semibold text-white">Secure by default</p>
              <p className="text-sm text-stone-200 mt-1">Passwords are hashed with bcrypt and never stored in plain text.</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/10 p-5">
              <p className="text-sm font-semibold text-white">Flexible login options</p>
              <p className="text-sm text-stone-200 mt-1">Log in with email, User ID, or mobile number.</p>
            </div>
          </div>
        </div>

        <div className="card p-8 sm:p-10">
          <h1 className="font-display text-3xl font-bold text-ink mb-2">Create your account</h1>
          <p className="text-stone-500 text-sm mb-8">Sign up and enjoy a premium marketplace experience.</p>

          {error && <p className="mb-4 text-sm text-red-600 bg-red-50 rounded-2xl px-4 py-3">{error}</p>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="text-sm font-semibold text-stone-600 block mb-2 uppercase tracking-[0.18em]">Full name</label>
              <input
                required
                placeholder="John Doe"
                className="input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <p className="text-xs text-stone-500 mt-2">Your unique User ID will be generated from your name.</p>
              {fieldErrors.name && <p className="text-xs text-red-600 mt-2">{fieldErrors.name}</p>}
            </div>

            <div>
              <label className="text-sm font-semibold text-stone-600 block mb-2 uppercase tracking-[0.18em]">Email</label>
              <input
                type="email"
                required
                placeholder="john@example.com"
                className="input"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              {fieldErrors.email && <p className="text-xs text-red-600 mt-2">{fieldErrors.email}</p>}
            </div>

            <div>
              <label className="text-sm font-semibold text-stone-600 block mb-2 uppercase tracking-[0.18em]">Phone (optional)</label>
              <input
                type="tel"
                placeholder="9876543210"
                className="input"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, '') })}
              />
              <p className="text-xs text-stone-500 mt-2">Enter a 10-digit mobile number to log in with your phone.</p>
              {fieldErrors.phone && <p className="text-xs text-red-600 mt-2">{fieldErrors.phone}</p>}
            </div>

            <div>
              <label className="text-sm font-semibold text-stone-600 block mb-2 uppercase tracking-[0.18em]">Password</label>
              <input
                type="password"
                required
                minLength={6}
                placeholder="Minimum 6 characters"
                className="input"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <p className="text-xs text-stone-500 mt-2">Securely hashed with bcrypt. Never stored in plain text.</p>
              {fieldErrors.password && <p className="text-xs text-red-600 mt-2">{fieldErrors.password}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base font-semibold">
              {loading ? 'Creating account...' : 'Create account securely'}
            </button>
          </form>

          <p className="text-sm text-stone-500 mt-6 text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-plum-700 font-medium hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
