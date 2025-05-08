const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();
const { ManagementClient } = require('auth0');

const {
  AUTH0_DOMAIN,
  AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET,
  AUTH0_AUDIENCE,
  ADMIN_ROLE_ID,
} = process.env;

// 🔐 Auth0 Management API token caching
let managementToken = null;
let tokenExpiry = 0;

// 🔧 Initialize Auth0 ManagementClient
const management = new ManagementClient({
  domain: AUTH0_DOMAIN,
  clientId: AUTH0_CLIENT_ID,
  clientSecret: AUTH0_CLIENT_SECRET,
  scope: 'read:users update:users read:roles delete:roles',
});

// 🔐 Helper: Get Management API token (for axios calls)
async function getManagementToken() {
  const now = Math.floor(Date.now() / 1000);
  if (managementToken && tokenExpiry > now) return managementToken;

  const response = await axios.post(`https://${AUTH0_DOMAIN}/oauth/token`, {
    client_id: AUTH0_CLIENT_ID,
    client_secret: AUTH0_CLIENT_SECRET,
    audience: AUTH0_AUDIENCE,
    grant_type: 'client_credentials'
  });

  managementToken = response.data.access_token;
  tokenExpiry = now + response.data.expires_in - 60;
  return managementToken;
}

// ✅ GET: Basic user list (no roles)
router.get('/users', async (req, res) => {
  try {
    const token = await getManagementToken();
    const response = await axios.get(`https://${AUTH0_DOMAIN}/api/v2/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// ✅ GET: Users with their roles
router.get('/users-with-roles', async (req, res) => {
  try {
    const token = await getManagementToken();
    const usersRes = await axios.get(`https://${AUTH0_DOMAIN}/api/v2/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const users = usersRes.data;
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const enrichedUsers = [];

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      try {
        await delay(300);
        const rolesRes = await axios.get(
          `https://${AUTH0_DOMAIN}/api/v2/users/${user.user_id}/roles`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        enrichedUsers.push({
          user_id: user.user_id,
          name: user.name,
          email: user.email,
       roles: rolesRes.data.map(role => role.name),
        });
      } catch (roleErr) {
        console.error(`Failed to get roles for ${user.email}`, roleErr.response?.data || roleErr.message);
        enrichedUsers.push({
          user_id: user.user_id,
          name: user.name,
          email: user.email,
          roles: [],
        });
      }
    }
    

    res.json(enrichedUsers);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch users with roles' });
  }
});

// ✅ POST: Assign admin role
router.post('/assign-admin', async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'Missing userId' });
  }

  try {
    const token = await getManagementToken();
    await axios.post(
      `https://${AUTH0_DOMAIN}/api/v2/roles/${ADMIN_ROLE_ID}/users`,
      { users: [userId] },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    res.status(200).json({ message: 'Admin role assigned' });
  } catch (err) {
    console.error('Assign admin failed:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to assign admin role' });
  }
});

// ✅ POST: Revoke admin role
router.post('/revoke-admin', async (req, res) => {
  const { userId } = req.body;

  try {
    if (!userId) {
      console.error('❌ Missing userId in request body');
      return res.status(400).json({ message: 'Missing userId' });
    }

    // Get all roles to find 'admin'
    const roles = await management.getRoles();
    console.log('✅ Available roles:', roles.map(r => ({ id: r.id, name: r.name })));

    const adminRole = roles.find(role => role.name.toLowerCase() === 'admin');
    if (!adminRole) {
      console.error('❌ Admin role not found');
      return res.status(404).json({ message: 'Admin role not found' });
    }

    console.log(`🚨 Removing role ${adminRole.id} from user ${userId}`);

    await management.removeRolesFromUser(
      { id: userId },
      { roles: [adminRole.id] }
    );

    console.log('✅ Role removed successfull');
    res.status(200).json({ message: 'Admin role revoked successfully' });

  } catch (error) {
    console.error('❌ Error revoking admin role:', error.message, error.stack);
    res.status(500).json({ message: 'Failed to revoke admin role' });
  }
});

module.exports = router;
