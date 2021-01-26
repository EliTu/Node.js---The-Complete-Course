import { Request, Response } from 'express';
import { check, body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';

import User from '../models/user';
import removeFile from './removeFile';

/* AUTH VALIDATIONS */

/**
 * Validation chain for the signup forms, will validate: email, password and confirm password.
 */
export const signupValidations = [
	check('email', 'Email is invalid or missing.') // checks the entire field for errors (body, params, cookies etc)
		.isEmail()
		.bail() // stop the validation chain if the previous validation failed
		.normalizeEmail() // data sanitization - ensure that the email is in the correct format (no capital letters etc)
		.custom(async (value: string) => {
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
		.custom((value: string, { req }) => {
			// custom validation field to check for password equality, also implicitly applies the validation rules passed on 'password'
			if (!value) return false;

			if (value !== req.body.password) {
				throw new Error('Passwords do not match.');
			}
			return true;
		}),
];

/**
 * Validation chain for the login forms, will validate: email and password.
 */
export const loginValidations = [
	body('email', 'Email is invalid or missing.')
		.isEmail()
		.bail()
		.normalizeEmail()
		.custom(async (value: string) => {
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
		.custom(async (value: string, { req }) => {
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

/**
 * Validation chain for the post product form, will validate: title, file-placeholder(hidden input), price and description.
 */
export const postProductValidation = [
	body('title')
		.isString()
		.isLength({ min: 4, max: 25 })
		.withMessage('Title field is empty or invalid.')
		.bail()
		.trim(),
	body('file-placeholder').custom((value: string, { req }) => {
		// express-validator by default validates string values, for files etc use a custom validation function and use the req to get the file
		// Though we have the multer filter function to validate on app.js, use this extra layer to validate and render error message with status 422
		const validImageFormats = ['jpg', 'jpeg', 'png', 'gif'];
		// if file already exists (in edit mode) then return true;
		if (value) {
			const [, imageFormat] = value.split('.');

			if (!validImageFormats.includes(imageFormat))
				throw new Error('Something is wrong with the attached file.');

			return true;
		}

		// if posting a new file
		if (!req.file)
			throw new Error(
				'File is missing or incorrect format (Should be an image of png/jpg/jpeg/gif format).'
			);

		const { mimetype, filename } = req.file as Express.Multer.File;
		const [, imageFormat] = mimetype.split('/');

		if (!filename || !mimetype)
			throw new Error('Something is wrong with the attached file.');
		if (!validImageFormats.includes(imageFormat))
			throw new Error('Attached file is not an image.');

		return true;
	}),
	body('price')
		.notEmpty()
		.withMessage('Price field is empty.')
		.bail()
		.isNumeric()
		.custom((value: string | number) => {
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

// TODO: ADD VALIDATIONS FOR EMAIL RESET FORM

/* UTILS */

/**
 * Calls the validationResult method to check for any validation errors, if found then it will render the same view with the forms being validated with the old data
 * and the validation errors array, also will set isFormInvalid to 'true' to stop the form submit process.
 * @param req The Express middleware req method. Used as an argument for the validationResult function.
 * @param res The Express middleware res method. Used to return a result with a status and body of data in case of validation errors.
 * @param path The path string to the current validated view.
 * @param renderOptions The data to be passed to the view in the response body, will contain the required data to render the view as well as form data.
 */
export const checkForValidationErrors = (
	req: Request,
	res: Response,
	path: string,
	renderOptions: Record<string, any> //TODO: TYPE- ADD BETTER TYPING HERE
) => {
	let isFormInvalid = false;
	const validationErrors = validationResult(req); // This method will collect all the errors that were found in the validation middleware (on the routes)

	// first check if the validationErrors array is empty (no errors found), if it's not then reject the form and re-render the page
	if (!validationErrors.isEmpty()) {
		if (req.file) removeFile(req.file.path);

		res.status(422).render(path, {
			...renderOptions,
			errorsArray: validationErrors.array(), // insert the entire error array to use it in the view to dynamically show input error styles
		});

		isFormInvalid = true;
	}

	return isFormInvalid;
};
