import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto'; // node-core module that can help generate random token
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import { Options } from 'nodemailer/lib/mailer';
import { Session, SessionData } from 'express-session';

import User, { UserModel } from '../models/user';
import setErrorMiddlewareObject from '../util/setErrorMiddlewareObject';
import { checkForValidationErrors } from '../util/validations';
import appForms from '../util/forms';
import emailTemplates from '../util/email-templates';
import setUserMessage from '../util/setUserMessage';

const {
	confirmationMail,
	passwordResetMail,
	passwordResetSuccess,
} = emailTemplates;
const { authForm, signupForm, passwordResetForm, newPasswordForm } = appForms;

/* AUTH UTILS */

// instantiate a MailTrap transporter with the MailTrap settings use it to send mails
const transporter = nodemailer.createTransport({
	host: 'smtp.mailtrap.io',
	port: 2525,
	auth: {
		user: '948e8cb96b7e8a',
		pass: 'd133b389eaa602',
	},
});

const setLoginUserSession = (
	user: UserModel,
	session: Session & Partial<SessionData>
) => {
	session.isLoggedIn = true;
	// save the mongoDB user to the session
	session.user = user;

	return session;
};

const setUserInitialName = (user: UserModel) => user.email.split('@')[0];

export const sendMail = (res: Response, { to, subject, html }: Options) => {
	transporter.sendMail(
		{ to, from: 'shop@nodecomplete.com', subject, html, date: `${Date.now()}` },
		(err, info) => {
			if (err) {
				console.error(err);
				res.redirect('/');
			} else {
				console.log(
					`Email has been successfully sent with the id ${info.messageId}`
				);
			}
		}
	);
};

/* GET Controls */

export const getLoginPage = (req: Request, res: Response) => {
	res.render('auth/login', {
		docTitle: 'Login',
		pageSubtitle: 'Enter details to log in',
		forms: authForm,
		path: '/login',
		error: setUserMessage(req.flash('error')),
		success: setUserMessage(req.flash('success')),
	});
};

export const getSignupPage = (req: Request, res: Response) => {
	res.render('auth/signup', {
		docTitle: 'Signup',
		pageSubtitle: 'Signup for our shop to view and buy products',
		forms: signupForm,
		path: '/signup',
		error: setUserMessage(req.flash('error')),
	});
};

export const getPasswordResetPage = (req: Request, res: Response) => {
	res.render('auth/reset-password', {
		docTitle: 'Password reset',
		pageSubtitle: 'Enter your email to reset your password',
		forms: passwordResetForm,
		path: '/reset-password',
		error: setUserMessage(req.flash('error')),
	});
};

export const getNewPasswordPage = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const token = req.params.token;
	try {
		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordTokenExpiration: { $gt: `${Date.now()}` }, // Also check the expiration token on the DB if its still valid with $gt operation
		});

		if (!user) {
			req.flash(
				'error',
				'Invalid password reset request. Please reset the password by following the link in the password reset email'
			); // flash an error message onto the session with the flash middleware
			return res.redirect('/');
		}

		res.render('auth/new-password', {
			docTitle: 'Password reset',
			pageSubtitle: 'Enter your your new password',
			forms: newPasswordForm,
			path: '/new-password',
			error: setUserMessage(req.flash('error')),
			userId: user._id.toString(),
			passwordToken: token,
		});
	} catch (error) {
		setErrorMiddlewareObject(error, next);
	}
};

/* POST CONTROLS */

export const postLogin = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { email } = req.body as UserModel;
	const isFormInvalid = checkForValidationErrors(req, res, 'auth/login', {
		docTitle: 'Login',
		pageSubtitle: 'Enter details to log in',
		forms: authForm,
		path: '/login',
		prevData: { email, password: '' },
		success: setUserMessage(req.flash('success')),
	});
	if (isFormInvalid) return;

	try {
		const user = await User.findOne({ email: email });
		return setLoginUserSession(user, req.session).save((err) => {
			if (err) {
				setErrorMiddlewareObject(err, next);
			}

			const userInitialName = setUserInitialName(user);
			req.flash('success', `Welcome back, ${userInitialName}!`);
			return res.redirect('/');
		});
	} catch (error) {
		setErrorMiddlewareObject(error, next);
	}
};

export const postSignup = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { email, password } = req.body as UserModel;

	const isFormInvalid = checkForValidationErrors(req, res, 'auth/signup', {
		docTitle: 'Signup',
		pageSubtitle: 'Signup for our shop to view and buy products',
		forms: signupForm,
		path: '/signup',
		prevData: { email, password, confirm: req.body.confirm }, // pass prev data to value fields in order to better the UX
	});
	if (isFormInvalid) return;

	try {
		// encrypt the password to a hashed string form before storing
		const hashedPassword = await bcrypt.hash(password, 12);

		const newUser = new User({
			email,
			password: hashedPassword,
			cart: { items: [] },
		});
		await newUser.save();

		return setLoginUserSession(newUser, req.session).save((err) => {
			if (err) {
				setErrorMiddlewareObject(err, next);
			}

			const userInitialName = setUserInitialName(newUser);
			req.flash(
				'success',
				`Welcome, ${userInitialName}! a confirmation mail has been sent to ${email}`
			);
			res.redirect('/'); // Redirect before sending the confirmation mail

			// use the transporter to send an email async
			return sendMail(res, {
				to: email,
				subject: 'Signup succeeded!',
				html: confirmationMail,
			});
		});
	} catch (error) {
		setErrorMiddlewareObject(error, next);
	}
};

export const postLogout = (req: Request, res: Response, next: NextFunction) => {
	try {
		req.session.destroy(() => {
			res.redirect('/login');
		});
	} catch (error) {
		setErrorMiddlewareObject(error, next);
	}
};

export const postPasswordReset = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { email: userEmail } = req.body as UserModel;

	// use the crypto module to generate random string with 32 bytes
	crypto.randomBytes(32, async (err, buffer) => {
		if (err) {
			req.flash('error', 'Something went wrong!');
			return res.redirect('/reset-password');
		}
		// generate a token from the buffer by converting it to string and passing hex to convert hexadecimal values
		const token = buffer.toString('hex');

		try {
			if (!userEmail) {
				req.flash('error', `Please enter a valid email into the email field!`);
				return res.redirect('/reset-password');
			}

			const user = await User.findOne({ email: userEmail });
			if (!user) {
				req.flash(
					'error',
					`No user found for ${userEmail}, please check your email`
				);
				return res.redirect('/reset-password');
			}
			user.resetPasswordToken = token;
			user.resetPasswordTokenExpiration = Date.now() + 8.64e7; // set expiration date to 24 hours from the request time
			await user.save();

			req.flash(
				'success',
				`a password reset email has been sent to ${userEmail}`
			);
			res.redirect('/');

			return sendMail(res, {
				to: userEmail,
				subject: 'Reset password',
				html: passwordResetMail(token),
			});
		} catch (error) {
			setErrorMiddlewareObject(error, next);
		}
	});
};

export const postNewPassword = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	type NewPasswordData = {
		password: string;
		newPassword: string;
		userId: UserModel['_id'];
		passwordToken: string;
	};
	const {
		password: newPassword,
		userId,
		passwordToken,
	} = req.body as NewPasswordData;

	try {
		const user = await User.findOne({
			_id: userId,
			resetPasswordToken: passwordToken,
			resetPasswordTokenExpiration: { $gt: Date.now() },
		});
		if (!user) {
			req.flash('error', 'Something went wrong, no user found!');
			return res.redirect('/');
		}
		const hashedPassword = await bcrypt.hash(newPassword, 12);

		user.password = hashedPassword;
		user.resetPasswordToken = undefined;
		user.resetPasswordTokenExpiration = undefined;
		await user.save();

		req.flash('success', `Password reset successfully`);
		res.redirect('/login');

		return sendMail(res, {
			to: user.email,
			subject: 'Password reset success',
			html: passwordResetSuccess,
		});
	} catch (error) {
		setErrorMiddlewareObject(error, next);
	}
};
