const { authForm } = require('../util/forms');

const getLoginPage = (req, res) => {
	const isLoggedIn = req.session.isLoggedIn;
	console.log(isLoggedIn);
	res.render('auth/login', {
		docTitle: 'Login',
		pageSubtitle: 'Enter details to log in',
		forms: authForm,
		path: '/login',
		isLoggedIn: isLoggedIn,
	});
};

const postLogin = (req, res) => {
	req.session.isLoggedIn = true;
	res.redirect('/');
};

module.exports = { getLoginPage, postLogin };
