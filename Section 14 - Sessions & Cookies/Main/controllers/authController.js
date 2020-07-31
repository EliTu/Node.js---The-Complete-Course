const { authForm } = require('../util/forms');

const getLoginPage = (req, res) => {
	console.log(req.get('Cookie'));
	const isLoggedIn =
		req.get('Cookie') && Boolean(req.get('Cookie').split('=')[1]);
	res.render('auth/login', {
		docTitle: 'Login',
		pageSubtitle: 'Enter details to log in',
		forms: authForm,
		path: '/login',
		isLoggedIn: isLoggedIn,
	});
};

const postLogin = (req, res) => {
	res.setHeader('Set-Cookie', 'loggedIn=true');
	res.redirect('/');
};

module.exports = { getLoginPage, postLogin };
