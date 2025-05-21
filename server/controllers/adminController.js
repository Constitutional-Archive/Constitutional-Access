const { ManagementClient } = require('auth0');
const auth0 = new ManagementClient({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_M2M_CLIENT_ID,
  clientSecret: process.env.AUTH0_M2M_CLIENT_SECRET
});

exports.getPendingUsers = async (req, res) => {
  try {
    // In a real app, query your database for pending users
    const users = await auth0.getUsers({
      q: 'user_metadata.status:pending'
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

exports.approveUser = async (req, res) => {
  try {
    const { userId } = req.body;
    
    // 1. Assign admin role
    await auth0.assignRolesToUser(
      { id: userId },
      { roles: [process.env.AUTH0_ADMIN_ROLE_ID] }
    );

    // 2. Update user metadata
    await auth0.updateUserMetadata(
      { id: userId },
      { status: 'approved' }
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Approval failed:', error);
    res.status(500).json({ error: 'User approval failed' });
  }
};