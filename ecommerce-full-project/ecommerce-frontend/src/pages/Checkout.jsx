import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { placeOrder } from '../api/orders';

const paymentOptions = [
  {
    value: 'cod',
    title: 'Cash on Delivery',
    description: 'Pay in cash when your order arrives at your doorstep.',
  },
  {
    value: 'online',
    title: 'Online Payment',
    description: 'Mark this order for online payment processing.',
  },
];

const Checkout = () => {
  const { user } = useAuth();
  const { items, totalPrice, emptyCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState(() => ({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zip: user?.address?.zip || '',
    country: user?.address?.country || 'India',
    phone: user?.phone || '',
  }));
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const shipping = totalPrice > 500 ? 0 : 49;
  const grandTotal = totalPrice + shipping;

  const updateAddress = (field, value) => {
    setAddress((current) => ({ ...current, [field]: value }));
  };

  const validateCheckout = () => {
    const requiredFields = ['street', 'city', 'state', 'zip', 'country', 'phone'];
    const missingField = requiredFields.find((field) => !address[field].trim());

    if (missingField) return 'Please complete all shipping details before placing the order.';
    if (!/^\d{10}$/.test(address.phone)) return 'Please enter a valid 10 digit phone number.';
    if (!paymentOptions.some((option) => option.value === paymentMethod)) return 'Please select a payment method.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validateCheckout();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const res = await placeOrder({
        items: items.map((item) => ({ product: item.product, quantity: item.quantity })),
        shippingAddress: {
          street: address.street.trim(),
          city: address.city.trim(),
          state: address.state.trim(),
          zip: address.zip.trim(),
          country: address.country.trim(),
          phone: address.phone.trim(),
        },
        paymentMethod,
      });

      emptyCart();
      setSuccess(res.message || 'Order placed successfully!');
      setTimeout(() => {
        navigate(`/orders/${res.data._id}`, {
          replace: true,
          state: { message: res.message || 'Order placed successfully!' },
        });
      }, 900);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="card p-10">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-500 mb-4">Order confirmed</p>
          <h1 className="font-display text-3xl font-bold mb-3">Order placed successfully!</h1>
          <p className="text-stone-500 mb-6">Your cart has been cleared. Taking you to your order confirmation now.</p>
          <Link to="/orders" className="btn-primary">
            View my orders
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="card p-10">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-500 mb-4">Cart is empty</p>
          <h1 className="font-display text-3xl font-bold mb-3">Looks like you need a fresh start.</h1>
          <p className="text-stone-500 mb-6">Add products to your cart and experience a premium checkout flow.</p>
          <Link to="/products" className="btn-primary">
            Explore curated products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 lg:grid-cols-[1.3fr_0.9fr] gap-8 lg:gap-10">
      <div className="space-y-6">
        <div className="glass-card p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-amber-500">Secure checkout</p>
              <h1 className="font-display text-3xl font-bold text-ink mt-3">Complete your order</h1>
              <p className="text-stone-500 mt-2">Confirm shipping, choose how you want to pay, and place your order.</p>
            </div>
            <div className="rounded-[24px] border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-500 shadow-sm">
              <p className="font-semibold text-stone-600">Total payable</p>
              <p className="text-2xl font-display mt-1 text-ink">Rs. {grandTotal.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-[24px] border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-8 space-y-7">
          <section className="space-y-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-ink">Shipping Address</h2>
                <p className="text-sm text-stone-500">Where should we deliver your order?</p>
              </div>
              <span className="w-fit rounded-full bg-amber-400/15 px-3 py-1 text-xs uppercase tracking-[0.24em] text-amber-500">Fast delivery</span>
            </div>
            <input
              required
              placeholder="Street address"
              className="input"
              value={address.street}
              onChange={(e) => updateAddress('street', e.target.value)}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                required
                placeholder="City"
                className="input"
                value={address.city}
                onChange={(e) => updateAddress('city', e.target.value)}
              />
              <input
                required
                placeholder="State"
                className="input"
                value={address.state}
                onChange={(e) => updateAddress('state', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                required
                placeholder="PIN code"
                className="input"
                value={address.zip}
                onChange={(e) => updateAddress('zip', e.target.value.replace(/\D/g, '').slice(0, 10))}
              />
              <input
                required
                placeholder="Country"
                className="input"
                value={address.country}
                onChange={(e) => updateAddress('country', e.target.value)}
              />
              <input
                required
                inputMode="numeric"
                placeholder="Phone number"
                className="input"
                value={address.phone}
                onChange={(e) => updateAddress('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
              />
            </div>
          </section>

          <section className="space-y-3">
            <div>
              <h2 className="text-lg font-semibold text-ink">Payment Method</h2>
              <p className="text-sm text-stone-500">Select how you want to pay before placing the order.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {paymentOptions.map((option) => {
                const selected = paymentMethod === option.value;
                return (
                  <label
                    key={option.value}
                    className={`cursor-pointer rounded-[24px] border p-4 transition-all ${
                      selected
                        ? 'border-amber-400 bg-amber-400/10 shadow-[0_18px_50px_-34px_rgba(245,165,36,0.8)]'
                        : 'border-stone-200 bg-stone-50/80 hover:border-stone-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={option.value}
                      checked={selected}
                      onChange={() => setPaymentMethod(option.value)}
                      className="sr-only"
                    />
                    <span className="flex items-start gap-3">
                      <span
                        className={`mt-1 h-4 w-4 rounded-full border ${
                          selected ? 'border-amber-400 bg-amber-400' : 'border-stone-400'
                        }`}
                      />
                      <span>
                        <span className="block font-semibold text-ink">{option.title}</span>
                        <span className="mt-1 block text-sm text-stone-500">{option.description}</span>
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </section>

          <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-base font-semibold">
            {loading ? 'Placing order...' : `Place Order - Rs. ${grandTotal.toLocaleString('en-IN')}`}
          </button>
        </form>
      </div>

      <aside className="space-y-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-stone-500">Order summary</p>
              <h2 className="font-semibold text-2xl text-ink">Your picks</h2>
            </div>
            <span className="text-xs uppercase tracking-[0.28em] text-amber-500">Verified</span>
          </div>

          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.product} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-sm text-ink truncate">{item.name}</p>
                  <p className="text-xs text-stone-500">Qty {item.quantity}</p>
                </div>
                <p className="font-semibold text-sm">Rs. {(item.price * item.quantity).toLocaleString('en-IN')}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-stone-200/80 pt-4 space-y-3 text-sm text-stone-500">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>Rs. {totalPrice.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `Rs. ${shipping}`}</span>
            </div>
          </div>

          <div className="mt-4 border-t border-stone-200/80 pt-4 flex items-center justify-between text-base font-semibold text-ink">
            <span>Total</span>
            <span>Rs. {grandTotal.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="rounded-[28px] border border-stone-200 bg-stone-50/80 p-6 shadow-[0_22px_60px_-36px_rgba(0,0,0,0.75)]">
          <p className="text-sm uppercase tracking-[0.28em] text-plum-400 mb-3">Why shop with us?</p>
          <ul className="space-y-3 text-sm text-stone-500">
            <li className="flex gap-3"><span className="font-semibold text-plum-400">OK</span> Premium packaging</li>
            <li className="flex gap-3"><span className="font-semibold text-plum-400">OK</span> 24/7 order support</li>
            <li className="flex gap-3"><span className="font-semibold text-plum-400">OK</span> Fast, reliable delivery</li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default Checkout;
