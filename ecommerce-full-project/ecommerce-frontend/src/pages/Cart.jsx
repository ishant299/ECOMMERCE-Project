import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, emptyCart, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-stone-500 mb-6">Add a few products to get started.</p>
        <Link to="/products" className="btn-primary">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold">Your Cart</h1>
          <p className="text-sm text-stone-500 mt-1">Review your selected products and prepare for checkout.</p>
        </div>
        <button onClick={emptyCart} className="text-sm text-red-600 hover:underline">
          Empty cart
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.45fr_0.95fr]">
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.product} className="card p-5 grid gap-4 sm:grid-cols-[96px_1fr_170px] items-center">
              <div className="w-full h-24 bg-stone-100 rounded-3xl overflow-hidden">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-400 font-display text-sm">
                    No image
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-ink truncate">{item.name}</p>
                <p className="text-sm text-stone-500 mt-1">₹{item.price.toLocaleString('en-IN')} each</p>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center border border-stone-200 rounded-tag bg-white">
                  <button
                    onClick={() => updateQuantity(item.product, item.quantity - 1)}
                    className="px-3 py-2 text-stone-600 hover:text-plum-700"
                  >
                    −
                  </button>
                  <span className="px-3 text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product, item.quantity + 1)}
                    className="px-3 py-2 text-stone-600 hover:text-plum-700"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.product)}
                  className="text-stone-400 hover:text-red-600 text-sm"
                  aria-label="Remove"
                >
                  ✕
                </button>
              </div>
              <p className="font-display font-semibold text-right text-ink">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
            </div>
          ))}
        </div>

        <div className="glass-card p-6">
          <div className="mb-4">
            <p className="text-sm uppercase tracking-[0.18em] text-amber-600">Order summary</p>
            <h2 className="mt-3 text-2xl font-semibold text-ink">Ready to checkout</h2>
          </div>
          <div className="space-y-4 border-t border-stone-200 pt-4">
            <div className="flex items-center justify-between text-sm text-stone-600">
              <span>Item total</span>
              <span>₹{totalPrice.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-stone-600">
              <span>Shipping</span>
              <span className="font-medium">{totalPrice > 500 ? 'Free' : '₹49'}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-stone-600">
              <span>Estimated tax</span>
              <span className="font-medium">Calculated later</span>
            </div>
          </div>
          <div className="mt-6 border-t border-stone-200 pt-4">
            <div className="flex items-center justify-between text-base font-semibold text-ink">
              <span>Total</span>
              <span>₹{totalPrice.toLocaleString('en-IN')}</span>
            </div>
            <button onClick={handleCheckout} className="btn-primary w-full mt-6 py-3">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
