const express = require('express');
const router = express.Router();
const { approveUser, getPendingUsers } = require('../controllers/adminController');
const { checkJwt, checkRole } = require('../middleware/auth');

router.get('/pending-users', checkJwt, checkRole('superadmin'), getPendingUsers);
router.post('/approve-user', checkJwt, checkRole('superadmin'), approveUser);

module.exports = router;