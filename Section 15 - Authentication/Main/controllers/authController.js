const { authForm, signupForm } = require('../util/forms');
const User = require('../models/user');
const bcrypt = require('bcrypt');

const setLoginUserSession = (user, session) => {
	session.isLoggedIn = true;
	// save the mongoDB user to the session
	session.user = user;

	return session;
};

const getLoginPage = (req, res) => {
	res.render('auth/login', {
		docTitle: 'Login',
		pageSubtitle: 'Enter details to log in',
		forms: authForm,
		path: '/login',
	});
};

const getSignupPage = (req, res) => {
	res.render('auth/signup', {
		docTitle: 'Signup',
		pageSubtitle: 'Signup for our shop to view and buy products',
		forms: signupForm,
		path: '/signup',
	});
};

const postLogin = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email: email });
		if (!user) {
			console.error('This email does not exist!');
			return res.redirect('/login');
		}
		// validate the password with bcrypt by comparing the raw password to the hash
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			console.error('Password is incorrect!');
			return res.redirect('/login');
		}

		return setLoginUserSession(user, req.session).save((err) => {
			if (err) console.log(err);
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
				console.error('Email already used!');

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
		req.session.destroy(() => res.redirect('/'));
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
