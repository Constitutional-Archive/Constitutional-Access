import React, { useEffect, useState, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { Shield, Users, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

const SuperAdminPage = () => {
  const { user } = useAuth0();
  const roles = user?.['https://constifind-api.com/roles'] || [];

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  const API_BASE = process.env.REACT_APP_API_BASE_URL;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/auth0/users-with-roles`);
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  const updateUserRoles = async (userId, endpoint) => {
    setActionLoading((prev) => ({ ...prev, [userId]: true }));
    try {
      await axios.post(`${API_BASE}/api/auth0/${endpoint}`, { userId });
      await new Promise((res) => setTimeout(res, 300));
      await fetchUsers();
    } catch (err) {
      console.error(`Error on ${endpoint}:`, err);
    } finally {
      setActionLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const assignAdmin = (userId) => updateUserRoles(userId, 'assign-admin');
  const revokeAdmin = (userId) => updateUserRoles(userId, 'revoke-admin');

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (!roles.includes('super_admin')) {
    return (
      <section className="p-8 text-center">
        <header>
          <h2 className="text-2xl font-bold text-red-600">Unauthorized Access</h2>
        </header>
        <p>Only superadmins can access this page.</p>
      </section>
    );
  }

  const normalizeRoles = (roleArray) =>
    roleArray.map(r => (typeof r === 'string' ? r : r?.name)).filter(Boolean);

  const usersWithAdminRole = users.filter(u =>
    normalizeRoles(u.roles).includes('admin')
  );

  const usersPendingApproval = users.filter(u =>
    !normalizeRoles(u.roles).includes('admin')
  );

  return (
    <main className="max-w-5xl mx-auto p-6">
      <header className="mb-8 flex items-center">
        <Shield className="h-8 w-8 text-purple-600 me-2" />
        <h1 className="text-2xl font-bold">User Role Manager</h1>
      </header>

      {/* Pending Approval Users */}
      <section className="bg-white rounded-lg shadow p-6 mb-10">
        <header className="mb-4 flex items-center">
          <Users className="h-5 w-5 text-yellow-500 me-2" />
          <h2 className="text-lg font-semibold">
            Pending Approval ({usersPendingApproval.length})
          </h2>
        </header>
        {loading ? (
          <p className="text-gray-500">Loading users...</p>
        ) : (
          <ul className="space-y-4">
            {usersPendingApproval.map(u => {
              const roleList = normalizeRoles(u.roles);
              const isLoading = actionLoading[u.user_id];
              return (
                <li key={u.user_id}>
                  <article className="flex justify-between items-center p-4 border rounded-lg">
                    <section>
                      <h3 className="font-medium">{u.name || u.email}</h3>
                      <p className="text-sm text-gray-600">{u.email}</p>
                      <p className="text-sm text-gray-500">
                        Roles: {roleList.length ? roleList.join(', ') : 'None'}
                      </p>
                    </section>
                    <aside>
                      <button
                        onClick={() => assignAdmin(u.user_id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-full disabled:opacity-50"
                        disabled={isLoading}
                        title="Assign Admin"
                      >
                        {isLoading ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <CheckCircle2 className="h-5 w-5" />
                        )}
                      </button>
                    </aside>
                  </article>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Active Admins */}
      <section className="bg-white rounded-lg shadow p-6">
        <header className="mb-4 flex items-center">
          <Users className="h-5 w-5 text-blue-500 me-2" />
          <h2 className="text-lg font-semibold">
            Active Admins ({usersWithAdminRole.length})
          </h2>
        </header>
        {loading ? (
          <p className="text-gray-500">Loading users...</p>
        ) : (
          <ul className="space-y-4">
            {usersWithAdminRole.map(u => {
              const roleList = normalizeRoles(u.roles);
              const isLoading = actionLoading[u.user_id];
              return (
                <li key={u.user_id}>
                  <article className="flex justify-between items-center p-4 border rounded-lg">
                    <section>
                      <h3 className="font-medium">{u.name || u.email}</h3>
                      <p className="text-sm text-gray-600">{u.email}</p>
                      <p className="text-sm text-gray-500">Roles: {roleList.join(', ')}</p>
                    </section>
                    <aside>
                      <button
                        onClick={() => revokeAdmin(u.user_id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full disabled:opacity-50"
                        disabled={isLoading}
                        title="Revoke Admin"
                      >
                        {isLoading ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <XCircle className="h-5 w-5" />
                        )}
                      </button>
                    </aside>
                  </article>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
};

export default SuperAdminPage;
