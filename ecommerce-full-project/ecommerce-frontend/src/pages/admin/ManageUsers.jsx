import { useEffect, useState } from 'react';
import { getUsers, updateUser, deleteUser } from '../../api/users';
import { useAuth } from '../../context/AuthContext';
import { Spinner } from '../../components/Feedback';

const ManageUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getUsers({ limit: 100 });
      setUsers(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleActive = async (u) => {
    await updateUser(u._id, { isActive: !u.isActive });
    load();
  };

  const toggleRole = async (u) => {
    await updateUser(u._id, { role: u.role === 'admin' ? 'customer' : 'admin' });
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user account?')) return;
    await deleteUser(id);
    load();
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Manage Users</h1>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-100 text-left text-stone-500">
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Email</th>
              <th className="p-4 font-medium">Role</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {users.map((u) => (
              <tr key={u._id}>
                <td className="p-4 font-medium">{u.name}</td>
                <td className="p-4 text-stone-600">{u.email}</td>
                <td className="p-4">
                  <span className="tag-chip bg-plum-50 text-plum-700 capitalize">{u.role}</span>
                </td>
                <td className="p-4">
                  <span className={`tag-chip ${u.isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                    {u.isActive ? 'Active' : 'Disabled'}
                  </span>
                </td>
                <td className="p-4 flex gap-3 text-xs">
                  {u._id !== currentUser._id && (
                    <>
                      <button onClick={() => toggleRole(u)} className="text-plum-700 hover:underline">
                        Make {u.role === 'admin' ? 'Customer' : 'Admin'}
                      </button>
                      <button onClick={() => toggleActive(u)} className="text-stone-600 hover:underline">
                        {u.isActive ? 'Disable' : 'Enable'}
                      </button>
                      <button onClick={() => handleDelete(u._id)} className="text-red-600 hover:underline">
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
