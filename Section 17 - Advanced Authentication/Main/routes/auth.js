const express = require('express');
const router = express.Router();

const {
	getLoginPage,
	getSignupPage,
	getPasswordResetPage,
	postLogin,
	postLogout,
	postSignup,
} = require('../controllers/authController');

router.get('/login', getLoginPage);
router.get('/signup', getSignupPage);
router.get('/reset-password', getPasswordResetPage);

router.post('/login', postLogin);
router.post('/logout', postLogout);
router.post('/signup', postSignup);

module.exports = router;
