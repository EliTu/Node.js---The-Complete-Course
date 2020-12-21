const { check, body } = require('express-validator');
const bcrypt = require('bcrypt');
const User = require('../models/user');

/* AUTH VALIDATIONS */

const signupValidations = [
	check('email') // checks the entire field for errors (body, params, cookies etc)
		.isEmail()
		.withMessage('Invalid or missing email')
		.normalizeEmail() // data sanitization - ensure that the email is in the correct format (no capital letters etc)
		.custom(async (value) => {
			try {
				// custom validation async function to check if the emails is already taken (instead of checking in the controller)
				const isEmailAlreadyUsed = await User.findOne({ email: value });
				if (isEmailAlreadyUsed) {
					return Promise.reject('Email has been already used!'); // Reject the promise to show the async result fail
				}
			} catch (error) {
				throw new Error(
					'There was an issue with the request process, please refresh the page and try again'
				);
			}
		}),
	body(
		// checks only the body of the field
		'password',
		'Password should be 4-12 characters long and contain numbers' // general message for all errors in this check
	)
		.isLength({ min: 4, max: 12 })
		.trim() // data sanitization - remove whitespace
		.matches(/\d/g),
	body('confirm')
		.isLength({ min: 4, max: 12 })
		.trim()
		.custom((value, { req }) => {
			// custom validation field to check for password equality, also implicitly applies the validation rules passed on 'password'
			if (value !== req.body.password) {
				throw new Error('Passwords do not match.');
			}
			return true;
		}),
];

const loginValidations = [
	body('email', 'Email is invalid or missing')
		.isEmail()
		.normalizeEmail()
		.custom(async (value) => {
			try {
				const user = await User.findOne({ email: value });
				if (!user) {
					return Promise.reject('Invalid email or password!');
				}
			} catch (error) {
				throw new Error(
					'There was an issue with the request process, please refresh the page and try again'
				);
			}
		}),
	body(
		'password',
		'Password is empty, should be at least 4 characters of text and numbers'
	)
		.isLength({ min: 4, max: 12 })
		// .matches(/\d/g) //TODO: think about this thingy
		.trim()
		.custom(async (value, { req }) => {
			try {
				const user = await User.findOne({ email: req.body.email });
				const isPasswordValid = await bcrypt.compare(value, user.password); // validate the password with bcrypt by comparing the raw password to the hash
				if (!isPasswordValid) {
					return Promise.reject('Invalid password!');
				}
			} catch (error) {
				throw new Error(
					'There was an issue with the request process, please refresh the page and try again'
				);
			}
		}),
];

/* PRODUCT VALIDATIONS */
const postProductValidation = [
	body('title')
		.isLength({ min: 4, max: 25 })
		.trim()
		.isAlphanumeric()
		.withMessage('Title is empty or invalid'),
	body('imageUrl')
		.isEmpty()
		.isURL()
		.trim()
		.withMessage('Image URL field is empty or invalid'),
	body('price')
		.isEmpty()
		.isNumeric()
		.custom((value) => {
			if (value === 0) {
				throw new Error('Price cannot be 0');
			}
			return true;
		}),
	body('description').isEmpty().isLength({ min: 4, max: 500 }).trim(),
];

/* UTILS */
const setValidationErrorMessage = (param, msg) =>
	`Something is not right with the ${param}: ${msg} `;

module.exports = {
	setValidationErrorMessage,
	signupValidations,
	loginValidations,
	postProductValidation,
};
