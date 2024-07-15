const express = require('express');
const { register, login, resetPassword, forgotPassword } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/resetPassword', resetPassword);

module.exports = router;
