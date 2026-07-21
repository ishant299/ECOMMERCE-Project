import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../api/orders';
import { Spinner, StatusBadge } from '../components/Feedback';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders()
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="glass-card p-8 mb-8">
        <p className="text-sm uppercase tracking-[0.28em] text-amber-600">Order history</p>
        <h1 className="font-display text-4xl font-bold text-ink mt-4">Your recent purchases</h1>
        <p className="mt-4 text-stone-500 max-w-2xl leading-relaxed">
          Track your orders, review order statuses, and revisit purchase details with confidence.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-sm uppercase tracking-[0.24em] text-amber-600 mb-3">No orders yet</p>
          <h2 className="font-display text-3xl font-semibold text-ink mb-2">Ready to shop your first premium item?</h2>
          <p className="text-stone-500 mb-6">Explore our catalog and place an order for express processing and delivery.</p>
          <Link to="/products" className="btn-primary">
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="grid gap-5">
          {orders.map((order) => (
            <Link
              key={order._id}
              to={`/orders/${order._id}`}
              className="card p-6 grid gap-4 sm:grid-cols-[1fr_auto] items-center hover:border-plum-700 transition-colors"
            >
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-stone-500">Order #{order._id.slice(-8).toUpperCase()}</p>
                <h3 className="mt-2 font-display text-xl font-semibold text-ink">{order.items.length} item{order.items.length !== 1 ? 's' : ''} · ₹{order.totalPrice.toLocaleString('en-IN')}</h3>
                <p className="text-sm text-stone-500 mt-2">
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <StatusBadge status={order.status} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
