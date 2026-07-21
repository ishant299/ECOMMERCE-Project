import { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { getOrder } from '../api/orders';
import { Spinner, StatusBadge } from '../components/Feedback';

const OrderDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    getOrder(id)
      .then((res) => setOrder(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Unable to load this order.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner />;
  if (error) return <p className="text-center py-20 text-red-300">{error}</p>;
  if (!order) return <p className="text-center py-20 text-stone-400">Order not found.</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {location.state?.message && (
        <div className="mb-6 rounded-[24px] border border-green-500/30 bg-green-500/10 p-4 text-sm font-semibold text-green-200">
          {location.state.message}
        </div>
      )}

      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-10">
        <div>
          <Link to="/orders" className="text-sm text-plum-400 hover:underline">
            Back to orders
          </Link>
          <h1 className="font-display text-4xl font-bold text-ink mt-4">Order #{order._id.slice(-8).toUpperCase()}</h1>
          <p className="text-sm text-stone-500 mt-2">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
        <div className="rounded-[24px] border border-stone-200 bg-stone-50 px-5 py-3 shadow-sm inline-flex items-center gap-3">
          <StatusBadge status={order.status} />
          <span className="text-sm text-stone-600">Status overview</span>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.95fr]">
        <div className="glass-card p-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-amber-500">Items in this order</p>
                <p className="font-display text-xl font-semibold text-ink mt-2">
                  {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="rounded-full bg-amber-400/15 px-4 py-2 text-sm font-semibold text-amber-500">
                Total Rs. {order.totalPrice.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="divide-y divide-stone-200">
              {order.items.map((item) => (
                <div key={item.product} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-stone-100 rounded-3xl overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs">No image</div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-ink">{item.name}</p>
                      <p className="text-sm text-stone-500">
                        Qty {item.quantity} x Rs. {item.price.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold text-sm text-ink">
                    Rs. {(item.price * item.quantity).toLocaleString('en-IN')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="card p-6">
            <h2 className="text-sm font-semibold text-stone-600 uppercase tracking-wide mb-4">Delivery details</h2>
            <p className="text-sm text-stone-700 leading-relaxed">
              {order.shippingAddress.street}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zip}
              <br />
              {order.shippingAddress.country}
              <br />
              Phone: {order.shippingAddress.phone}
            </p>
          </div>

          {order.customerInfo && (
            <div className="card p-6">
              <h2 className="text-sm font-semibold text-stone-600 uppercase tracking-wide mb-4">Customer</h2>
              <p className="text-sm text-stone-700 leading-relaxed">
                {order.customerInfo.name}
                <br />
                {order.customerInfo.email}
                <br />
                {order.customerInfo.phone}
              </p>
            </div>
          )}

          <div className="card p-6">
            <h2 className="text-sm font-semibold text-stone-600 uppercase tracking-wide mb-4">Payment summary</h2>
            <p className="text-sm text-stone-700">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
            <div className="mt-6 space-y-3 text-sm text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rs. {order.itemsPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{order.shippingPrice === 0 ? 'Free' : `Rs. ${order.shippingPrice}`}</span>
              </div>
              <div className="border-t border-stone-200 pt-3 flex justify-between font-semibold text-ink">
                <span>Total</span>
                <span>Rs. {order.totalPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default OrderDetail;
