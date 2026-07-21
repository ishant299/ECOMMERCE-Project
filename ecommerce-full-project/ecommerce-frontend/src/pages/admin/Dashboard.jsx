import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '../../api/dashboard';
import { Spinner, StatusBadge } from '../../components/Feedback';

const StatCard = ({ label, value }) => (
  <div className="card p-5">
    <p className="text-xs font-medium text-stone-500 uppercase tracking-wide">{label}</p>
    <p className="font-display text-2xl font-bold mt-1">{value}</p>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then((res) => setStats(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (!stats) return null;

  const maxRevenue = Math.max(...stats.monthlyRevenue.map((m) => m.revenue), 1);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Products" value={stats.totalProducts} />
        <StatCard label="Total Categories" value={stats.totalCategories} />
        <StatCard label="Total Orders" value={stats.totalOrders} />
        <StatCard label="Total Customers" value={stats.totalCustomers} />
        <StatCard label="Pending Orders" value={stats.pendingOrders} />
        <StatCard label="Delivered Orders" value={stats.deliveredOrders} />
        <StatCard label="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString('en-IN')}`} />
      </div>

      {stats.monthlyRevenue.length > 0 && (
        <div className="card p-6 mb-8">
          <h2 className="font-semibold mb-4">Revenue trend</h2>
          <div className="flex items-end gap-3 h-40">
            {stats.monthlyRevenue.map((m, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-plum-700 rounded-t-sm"
                  style={{ height: `${(m.revenue / maxRevenue) * 100}%`, minHeight: '4px' }}
                  title={`₹${m.revenue.toLocaleString('en-IN')}`}
                />
                <span className="text-[10px] text-stone-400">
                  {m._id.month}/{String(m._id.year).slice(-2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <h2 className="font-semibold">Recent Orders</h2>
          <Link to="/admin/orders" className="text-sm text-plum-700 hover:underline">
            View all →
          </Link>
        </div>
        <div className="divide-y divide-stone-100">
          {stats.recentOrders.map((o) => (
            <Link
              key={o._id}
              to={`/orders/${o._id}`}
              className="p-4 flex items-center justify-between hover:bg-plum-50/40"
            >
              <div>
                <p className="text-sm font-medium">#{o._id.slice(-8).toUpperCase()}</p>
                <p className="text-xs text-stone-500">{o.user?.name}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold">₹{o.totalPrice.toLocaleString('en-IN')}</span>
                <StatusBadge status={o.status} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
