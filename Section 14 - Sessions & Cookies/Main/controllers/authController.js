const { authForm } = require('../util/forms');
const User = require('../models/user');

const getLoginPage = (req, res) => {
	res.render('auth/login', {
		docTitle: 'Login',
		pageSubtitle: 'Enter details to log in',
		forms: authForm,
		path: '/login',
	});
};

const postLogin = async (req, res) => {
	try {
		const user = await User.findById('5f15f27574eaee3599a8d0de');
		if (user) {
			req.session.isLoggedIn = true;
			req.session.user = user;
			res.redirect('/');
		}
	} catch (error) {
		console.log(error);
	}
};

module.exports = { getLoginPage, postLogin };
