import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllOrders, updateOrderStatus, cancelOrder } from '../../api/orders';
import { Spinner, StatusBadge } from '../../components/Feedback';

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await getAllOrders({ status: statusFilter || undefined, limit: 100 });
      setOrders(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleStatusChange = async (id, status) => {
    await updateOrderStatus(id, status);
    load();
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this order and restock items?')) return;
    await cancelOrder(id);
    load();
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="font-display text-2xl font-bold">Manage Orders</h1>
        <select className="input !w-auto" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s[0].toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-100 text-left text-stone-500">
              <th className="p-4 font-medium">Order</th>
              <th className="p-4 font-medium">Customer</th>
              <th className="p-4 font-medium">Total</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {orders.map((o) => (
              <tr key={o._id}>
                <td className="p-4">
                  <Link to={`/orders/${o._id}`} className="text-plum-700 font-medium hover:underline">
                    #{o._id.slice(-8).toUpperCase()}
                  </Link>
                  <p className="text-xs text-stone-400">{new Date(o.createdAt).toLocaleDateString('en-IN')}</p>
                </td>
                <td className="p-4">
                  <p>{o.user?.name}</p>
                  <p className="text-xs text-stone-400">{o.user?.email}</p>
                </td>
                <td className="p-4 font-medium">₹{o.totalPrice.toLocaleString('en-IN')}</td>
                <td className="p-4">
                  <select
                    className="input !w-auto !py-1.5 !text-xs"
                    value={o.status}
                    onChange={(e) => handleStatusChange(o._id, e.target.value)}
                    disabled={o.status === 'cancelled'}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s[0].toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-4">
                  {o.status !== 'cancelled' && o.status !== 'delivered' && (
                    <button onClick={() => handleCancel(o._id)} className="text-red-600 hover:underline text-xs">
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p className="p-6 text-stone-400 text-center">No orders found.</p>}
      </div>
    </div>
  );
};

export default ManageOrders;
