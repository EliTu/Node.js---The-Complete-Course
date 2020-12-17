const express = require('express');
const { check, body } = require('express-validator');
const User = require('../models/user');

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
			.custom(async (value) => {
				// custom validation async function to check if the emails is already taken (instead of checking in the controller)
				const isEmailAlreadyUsed = await User.findOne({ email: value });
				if (isEmailAlreadyUsed) {
					return Promise.reject('Email has been already used!'); // Reject the promise to show the async result fail
				}
			}),
		body(
			// checks only the body of the field
			'password',
			'Password should be 4-12 characters long and contain numbers and text only' // general message for all errors in this check
		)
			.isLength({ min: 4, max: 12 })
			.isAlphanumeric(),
		body('confirm').custom((value, { req }) => {
			// custom validation field to check for password equality, also implicitly applies the validation rules passed on 'password'
			if (value !== req.body.password) {
				throw new Error('Passwords do not match.');
			}
			return true;
		}),
	],
	postSignup
);
router.post('/reset-password', postPasswordReset);
router.post('/new-password', postNewPassword);

module.exports = router;
