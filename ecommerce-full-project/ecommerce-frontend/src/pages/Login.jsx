import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ credential: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/home', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.credential, form.password);
      navigate(location.state?.from?.pathname || '/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16">
      <div className="max-w-6xl w-full grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="hidden lg:flex flex-col justify-center rounded-[32px] bg-gradient-to-br from-plum-900 via-slate-950 to-indigo-950 p-14 text-white shadow-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300 mb-4">Welcome back</p>
          <h1 className="font-display text-4xl font-bold leading-tight">Login to your account</h1>
          <p className="mt-5 max-w-md text-sm leading-7 text-stone-200">
            Access your order history, manage saved addresses, and checkout faster with a secure, professional experience.
          </p>
          <div className="mt-10 grid gap-4">
            <div className="rounded-[24px] border border-white/10 bg-white/10 p-5">
              <p className="text-sm font-semibold text-white">🔐 Multiple login options</p>
              <p className="text-sm text-stone-200 mt-1">Login with email, User ID, or mobile number.</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/10 p-5">
              <p className="text-sm font-semibold text-white">🛡️ Secure & encrypted</p>
              <p className="text-sm text-stone-200 mt-1">Your passwords are hashed and never stored in plain text.</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/10 p-5">
              <p className="text-sm font-semibold text-white">⚡ Fast checkout</p>
              <p className="text-sm text-stone-200 mt-1">Smooth checkout flow optimized for every device.</p>
            </div>
          </div>
        </div>

        <div className="card p-8 sm:p-10">
          <h1 className="font-display text-3xl font-bold text-ink mb-2">Welcome back</h1>
          <p className="text-stone-500 text-sm mb-8">Log in with your email, User ID, or mobile number to continue shopping.</p>

          {error && <p className="mb-4 text-sm text-red-600 bg-red-50 rounded-2xl px-4 py-3">{error}</p>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="text-sm font-semibold text-stone-600 block mb-2 uppercase tracking-[0.18em]">
                Email, User ID, or Mobile
              </label>
              <input
                type="text"
                required
                placeholder="john.doe@email.com, john.doe, or 9876543210"
                className="input"
                value={form.credential}
                onChange={(e) => setForm({ ...form, credential: e.target.value })}
              />
              <p className="text-xs text-stone-500 mt-2">
                Enter your registered email address, your unique User ID, or 10-digit mobile number.
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-stone-600 block mb-2 uppercase tracking-[0.18em]">Password</label>
              <input
                type="password"
                required
                placeholder="Enter your password"
                className="input"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <p className="text-xs text-stone-500 mt-2">Never share your password with anyone.</p>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base font-semibold">
              {loading ? 'Logging in…' : 'Log in securely'}
            </button>
          </form>

          <div className="mt-6 grid gap-4">
            <div className="text-center text-sm text-stone-500">
              New here?{' '}
              <Link to="/register" className="text-plum-700 font-semibold hover:underline">
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
