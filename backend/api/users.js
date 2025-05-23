
const express = require('express');
const { ManagementClient } = require('auth0');
require('dotenv').config();

const router = express.Router();

const management = new ManagementClient({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  scope: 'read:users read:roles',
});

router.get('/', async (req, res) => {
  try {
    const users = await management.getUsers();

    const enrichedUsers = await Promise.all(
      users.map(async (user) => {
        const roles = await management.getUserRoles({ id: user.user_id });
        return {
          user_id: user.user_id,
          name: user.name,
          email: user.email,
          roles: roles.map(r => r.name), // e.g., ['new_user'], ['admin']
        };
      })
    );

    res.json(enrichedUsers);
  } catch (error) {
    console.error('Error fetching users with roles:', error);
    res.status(500).json({ message: 'Failed to load users' });
  }
});

module.exports = router;
