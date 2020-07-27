const { authForm } = require('../util/forms');

const getLoginPage = (req, res) => {
	res.render('auth/login', {
		docTitle: 'Login',
		pageSubtitle: 'Enter details to log in',
		forms: authForm,
		path: '/login',
	});
};

module.exports = { getLoginPage };
