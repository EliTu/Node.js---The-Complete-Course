const { authForm, signupForm, passwordReset } = require('../util/forms');
const { confirmation } = require('../util/email-templates');
const setUserMessage = require('../util/setUserMessage');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

// instantiate a MailTrap transporter with the MailTrap settings use it to send mails
const transporter = nodemailer.createTransport({
	host: 'smtp.mailtrap.io',
	port: 2525,
	auth: {
		user: '948e8cb96b7e8a',
		pass: 'd133b389eaa602',
	},
});

const setLoginUserSession = (user, session) => {
	session.isLoggedIn = true;
	// save the mongoDB user to the session
	session.user = user;

	return session;
};

const setUserInitialName = (user) => user.email.split('@')[0];

const getLoginPage = (req, res) => {
	res.render('auth/login', {
		docTitle: 'Login',
		pageSubtitle: 'Enter details to log in',
		forms: authForm,
		path: '/login',
		error: setUserMessage(req.flash('error')),
	});
};

const getSignupPage = (req, res) => {
	res.render('auth/signup', {
		docTitle: 'Signup',
		pageSubtitle: 'Signup for our shop to view and buy products',
		forms: signupForm,
		path: '/signup',
		error: setUserMessage(req.flash('error')),
	});
};

const getPasswordResetPage = (req, res) => {
	res.render('auth/reset-password', {
		docTitle: 'Password reset',
		pageSubtitle: 'Enter your email to reset your password',
		forms: passwordReset,
		path: '/reset-password',
		error: setUserMessage(req.flash('error')),
	});
};

const postLogin = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email: email });
		if (!user) {
			req.flash('error', 'Invalid email or password!'); // flash an error message onto the session with the flash middleware

			return res.redirect('/login');
		}
		// validate the password with bcrypt by comparing the raw password to the hash
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			req.flash('error', 'Invalid email or password!');
			return res.redirect('/login');
		}

		return setLoginUserSession(user, req.session).save((err) => {
			if (err) console.log(err);

			const userInitialName = setUserInitialName(user);
			req.flash('success', `Welcome back, ${userInitialName}!`);
			return res.redirect('/');
		});
	} catch (error) {
		console.log(error);
	}
};

const postSignup = async (req, res) => {
	const { email, password, confirm } = req.body;

	if (email && password && confirm) {
		try {
			// first look if the email is already registered in the DB
			const isEmailAlreadyUsed = await User.findOne({ email: email });

			if (isEmailAlreadyUsed) {
				req.flash('error', 'Email has been already used!');
				return res.redirect('/signup');
			} else {
				// encrypt the password to a hashed string form before storing
				const hashedPassword = await bcrypt.hash(password, 12);

				const newUser = new User({
					email,
					password: hashedPassword,
					cart: { items: [] },
				});
				await newUser.save();

				return setLoginUserSession(newUser, req.session).save((err) => {
					if (err) throw new Error(err);

					const userInitialName = setUserInitialName(newUser);
					req.flash(
						'success',
						`Welcome, ${userInitialName}! a confirmation mail has been sent to ${email}`
					);
					res.redirect('/'); // Redirect before sending the confirmation mail

					// set the email options and content
					const emailOptions = {
						to: email,
						from: 'shop@nodecomplete.com',
						subject: 'Signup succeeded!',
						html: confirmation,
					};

					// use the transporter to send an email async
					return transporter.sendMail(emailOptions, (err, info) => {
						if (err) {
							console.error(err);
							res.redirect('/');
						} else {
							console.log(
								`Email has been successfully sent with the id ${info.messageId}`
							);
						}
					});
				});
			}
		} catch (error) {
			console.log(error);
		}
	}
};

const postLogout = async (req, res) => {
	try {
		req.session.destroy(() => {
			res.redirect('/');
		});
	} catch (error) {
		console.log(error);
	}
};

const postPasswordReset = async (req, res) => {
	try {
	} catch (error) {}
};

module.exports = {
	getLoginPage,
	getSignupPage,
	getPasswordResetPage,
	postLogin,
	postLogout,
	postSignup,
};
