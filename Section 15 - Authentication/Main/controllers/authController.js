const { authForm, signupForm } = require('../util/forms');
const setUserMessage = require('../util/setUserMessage');
const User = require('../models/user');
const bcrypt = require('bcrypt');

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
			req.flash('success', `Welcome, ${userInitialName}!`);
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
					if (err) console.log(err);

					const userInitialName = setUserInitialName(newUser);
					req.flash('success', `Welcome, ${userInitialName}!`);
					return res.redirect('/');
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

module.exports = {
	getLoginPage,
	getSignupPage,
	postLogin,
	postLogout,
	postSignup,
};
