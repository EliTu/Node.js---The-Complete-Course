const { check, body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const User = require('../models/user');

/* AUTH VALIDATIONS */

const signupValidations = [
	check('email', 'Email is invalid or missing.') // checks the entire field for errors (body, params, cookies etc)
		.isEmail()
		.bail() // stop the validation chain if the previous validation failed
		.normalizeEmail() // data sanitization - ensure that the email is in the correct format (no capital letters etc)
		.custom(async (value) => {
			try {
				// custom validation async function to check if the emails is already taken (instead of checking in the controller)
				const isEmailAlreadyUsed = await User.findOne({ email: value });
				if (isEmailAlreadyUsed) {
					return Promise.reject('Email has been already used.'); // Reject the promise to show the async result fail
				}
			} catch (error) {
				throw new Error(
					'There was an issue with the request process, please refresh the page and try again.'
				);
			}
		}),
	body(
		// checks only the body of the field
		'password',
		'Password should be 4-12 characters long and contain numbers.' // general message for all errors in this check
	)
		.isLength({ min: 4, max: 12 })
		.bail()
		.trim() // data sanitization - remove whitespace
		.matches(/\d/g),
	body(
		'confirm',
		'Confirmation password should the same as the password field.'
	)
		.isLength({ min: 4, max: 12 })
		.bail()
		.trim()
		.custom((value, { req }) => {
			// custom validation field to check for password equality, also implicitly applies the validation rules passed on 'password'
			if (!value) return false;

			if (value !== req.body.password) {
				throw new Error('Passwords do not match.');
			}
			return true;
		}),
];

const loginValidations = [
	body('email', 'Email is invalid or missing.')
		.isEmail()
		.bail()
		.normalizeEmail()
		.custom(async (value) => {
			if (!value) return false;
			try {
				const user = await User.findOne({ email: value });
				if (!user) {
					return Promise.reject('Invalid email or password.');
				}
			} catch (error) {
				throw new Error(
					'There was an issue with the request process, please refresh the page and try again.'
				);
			}
		}),
	body(
		'password',
		'Password should be 4-12 characters long and contain numbers.'
	)
		.isLength({ min: 4, max: 12 })
		.bail()
		.matches(/\d/g)
		.trim()
		.custom(async (value, { req }) => {
			if (!value) return false;
			try {
				const user = await User.findOne({ email: req.body.email });
				const isPasswordValid = await bcrypt.compare(value, user.password); // validate the password with bcrypt by comparing the raw password to the hash
				if (!isPasswordValid) {
					return Promise.reject('Invalid password.');
				}
			} catch (error) {
				throw new Error(
					'There was an issue with the request process, please refresh the page and try again.'
				);
			}
		}),
];

/* PRODUCT VALIDATIONS */
const postProductValidation = [
	body('title')
		.isString()
		.isLength({ min: 4, max: 25 })
		.withMessage('Title field is empty or invalid.')
		.bail()
		.trim(),
	body('imageUrl').custom((value, { req }) => {
		console.log(value, req.file);
		// express-validator by default validates string values, for files etc use a custom validation function and use the req to get the file
		// THough we have the multer filter function to validate on app.js, use this extra layer to validate and render error message with status 422
		if (!req.file)
			throw new Error(
				'File is missing or incorrect format (Should be an image of png/jpg/jpeg/gif format).'
			);

		const { mimetype, filename } = req.file;
		const [, imageType] = mimetype.split('/');
		const validImageFormats = ['jpg', 'jpeg', 'png', 'gif'];

		if (!filename || !mimetype)
			throw new Error('Something wrong with the attached file.');
		if (!validImageFormats.includes(imageType))
			throw new Error('Attached file is not an image.');

		return true;
	}),
	body('price')
		.notEmpty()
		.withMessage('Price field is empty.')
		.bail()
		.isNumeric()
		.custom((value) => {
			if (!value) return false;
			if (value === 0) {
				throw new Error('Price cannot be 0.');
			}
			return true;
		}),
	body('description')
		.notEmpty()
		.withMessage('Description field must be between 2 to 500 characters long.')
		.bail()
		.isLength({ min: 2, max: 500 })
		.trim(),
];

/* UTILS */

const checkForValidationErrors = (req, res, path, renderOptions) => {
	let isFormInvalid = false;
	const validationErrors = validationResult(req); // This method will collect all the errors that were found in the validation middleware (on the routes)

	// first check if the validationErrors array is empty (no errors found), if it's not then reject the form and re-render the page
	if (!validationErrors.isEmpty()) {
		res.status(422).render(path, {
			...renderOptions,
			errorsArray: validationErrors.array(), // insert the entire error array to use it in the view to dynamically show input error styles
		});

		isFormInvalid = true;
	}
	return isFormInvalid;
};

module.exports = {
	signupValidations,
	loginValidations,
	postProductValidation,
	checkForValidationErrors,
};
