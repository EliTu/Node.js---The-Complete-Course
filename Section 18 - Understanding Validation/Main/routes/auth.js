const express = require('express');
const { signupValidations, loginValidations } = require('../util/validations');

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

router.post('/login', loginValidations, postLogin);
router.post('/logout', postLogout);
router.post('/signup', signupValidations, postSignup);
router.post('/reset-password', postPasswordReset);
router.post('/new-password', postNewPassword);

module.exports = router;
