import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { Shield, Users, CheckCircle2, XCircle } from 'lucide-react';

const SuperAdminPage = () => {
  const { user } = useAuth0();
  const roles = user?.['https://constifind-api.com/roles'] || [];

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch users with roles
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${REACT_APP_SEARCH_BACKEND_URL}/api/auth0/users-with-roles`);
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  // ✅ Assign admin role
  const assignAdmin = async (userId) => {
    try {
      await axios.post(`${REACT_APP_SEARCH_BACKEND_URL}/api/auth0/assign-admin`, { userId });
      fetchUsers();
    } catch (err) {
      console.error('Error assigning admin role:', err);
    }
  };

  // ✅ Revoke admin role
  const revokeAdmin = async (userId) => {
    try {
      await axios.post(`${REACT_APP_SEARCH_BACKEND_URL}/api/auth0/revoke-admin`, { userId });
      fetchUsers();
    } catch (err) {
      console.error('Error revoking admin role:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Authorization check
  if (!roles.includes('superadmin')) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-red-600">Unauthorized Access</h2>
        <p>Only superadmins can access this page.</p>
      </div>
    );
  }

  // ✅ Role filters
  const usersWithNoRoles = users.filter(u => u.roles.length === 0);
  const usersWithAdminRole = users.filter(u => u.roles.includes('admin'));

  return (
    <div className="max-w-5xl mx-auto p-6">
      <header className="mb-8 flex items-center">
        <Shield className="h-8 w-8 text-purple-600 mr-2" />
        <h1 className="text-2xl font-bold">User Role Manager</h1>
      </header>

      {/* New Users */}
      <section className="bg-white rounded-lg shadow p-6 mb-10">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Users className="h-5 w-5 text-yellow-500 mr-2" />
          New Users (No Roles Assigned) ({usersWithNoRoles.length})
        </h2>
        {loading ? (
          <p className="text-gray-500">Loading users...</p>
        ) : (
          <div className="space-y-4">
            {usersWithNoRoles.map(u => (
              <div key={u.user_id} className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">{u.name || u.email}</h3>
                  <p className="text-sm text-gray-600">{u.email}</p>
                  <p className="text-sm text-gray-500">Roles: None</p>
                </div>
                <button
                  onClick={() => assignAdmin(u.user_id)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                  title="Assign Admin"
                >
                  <CheckCircle2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Active Admins */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Users className="h-5 w-5 text-blue-500 mr-2" />
          Active Admins ({usersWithAdminRole.length})
        </h2>
        {loading ? (
          <p className="text-gray-500">Loading users...</p>
        ) : (
          <div className="space-y-4">
            {usersWithAdminRole.map(u => (
              <div key={u.user_id} className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">{u.name || u.email}</h3>
                  <p className="text-sm text-gray-600">{u.email}</p>
                  <p className="text-sm text-gray-500">Roles: {u.roles.join(', ')}</p>
                </div>
                <button
                  onClick={() => revokeAdmin(u.user_id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                  title="Revoke Admin"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default SuperAdminPage;
