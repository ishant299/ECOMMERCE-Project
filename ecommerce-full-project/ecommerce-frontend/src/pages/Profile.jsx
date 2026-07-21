import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../api/auth';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zip: user?.address?.zip || '',
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updateProfile({
        name: form.name,
        phone: form.phone,
        address: { street: form.street, city: form.city, state: form.state, zip: form.zip },
      });
      const updatedUser = { ...user, ...res.data };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="glass-card p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-600">Account</p>
          <h1 className="font-display text-4xl font-bold text-ink mt-4">Personal profile</h1>
          <p className="mt-4 text-stone-500 max-w-2xl leading-relaxed">
            Update your profile details, keep your contact information current, and maintain a polished account presence across the storefront.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[28px] border border-white/30 bg-white/80 p-5 shadow-sm">
              <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Member</p>
              <p className="mt-2 text-xl font-semibold text-ink">Premium shopper</p>
            </div>
            <div className="rounded-[28px] border border-white/30 bg-white/80 p-5 shadow-sm">
              <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Orders</p>
              <p className="mt-2 text-xl font-semibold text-ink">Managed securely</p>
            </div>
          </div>
        </section>

        <section className="card p-8">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-semibold text-ink">Welcome back, {user?.name || 'Customer'}</h2>
              <p className="text-sm text-stone-500 mt-1">Your profile information is safely stored and ready for fast checkout.</p>
            </div>
            <div className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">Verified account</div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-stone-600 block mb-2">Name</label>
                <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-semibold text-stone-600 block mb-2">Email</label>
                <input className="input bg-stone-50" value={user?.email} disabled />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-stone-600 block mb-2">Phone</label>
              <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-stone-600 uppercase tracking-[0.18em]">Shipping address</p>
              <div className="grid gap-4">
                <input className="input" placeholder="Street" value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input className="input" placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                  <input className="input" placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
                  <input className="input" placeholder="ZIP" value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base font-semibold">
              {loading ? 'Saving…' : saved ? 'Saved ✓' : 'Save changes'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Profile;
