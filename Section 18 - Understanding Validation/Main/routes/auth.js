const express = require('express');
const { check } = require('express-validator');
const router = express.Router();

const {
	getLoginPage,
	getSignupPage,
	getPasswordResetPage,
	getNewPasswordPage,
	postLogin,
	postLogout,
	postSignup,
	postPasswordReset,
	postNewPassword,
} = require('../controllers/authController');

router.get('/login', getLoginPage);
router.get('/signup', getSignupPage);
router.get('/reset-password', getPasswordResetPage);
router.get('/new-password/:token', getNewPasswordPage);

router.post('/login', postLogin);
router.post('/logout', postLogout);
router.post(
	'/signup',
	check('email').isEmail().withMessage('Invalid email'),
	postSignup
);
router.post('/reset-password', postPasswordReset);
router.post('/new-password', postNewPassword);

module.exports = router;
