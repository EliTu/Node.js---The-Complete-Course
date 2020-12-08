const { authForm, signupForm } = require('../util/forms');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

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
	try {
		const user = await User.findById('5fcc61335688aa30eab2fe6d');
		if (user) {
			req.session.isLoggedIn = true;
			req.session.user = user;
			req.session.save((err) => {
				if (err) console.log(err);
				res.redirect('/');
			});
		}
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

				res.redirect('/signup');
			} else {
				try {
					// encrypt the password to a hashed string form before storing
					const hashedPassword = await bcrypt.hash(password, 12);

					const newUser = new User({
						email,
						password: hashedPassword,
						cart: { items: [] },
					});
					await newUser.save();

					res.redirect('/');
				} catch (error) {
					console.log(error);
				}
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
