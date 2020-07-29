const { authForm } = require('../util/forms');

const getLoginPage = (req, res) => {
	res.render('auth/login', {
		docTitle: 'Login',
		pageSubtitle: 'Enter details to log in',
		forms: authForm,
		path: '/login',
		isLoggedIn: req.isLoggedIn,
	});
};

const postLogin = (req, res) => {
	req.isLoggedIn = true;
	res.redirect('/');
};

module.exports = { getLoginPage, postLogin };
