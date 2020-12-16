const express = require('express');
const { check, body } = require('express-validator');
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
	[
		check('email') // checks the entire field for errors (body, params, cookies etc)
			.isEmail()
			.withMessage('Invalid email')
			.custom((value, { req }) => {
				if (!value.endsWith('.com')) {
					throw new Error(`Email must end with a '.com'`);
				}
				return true;
			}),
		body(
			// checks only the body of the field
			'password',
			'Password should be 4-12 characters long and contain numbers and text only' // general message for all errors in this check
		)
			.isLength({ min: 4, max: 12 })
			.isAlphanumeric(),
		body('confirm').isLength({ min: 4, max: 12 }).isAlphanumeric(),
	],
	postSignup
);
router.post('/reset-password', postPasswordReset);
router.post('/new-password', postNewPassword);

module.exports = router;
