const forms = require('../util/forms');

const getLoginPage = (req, res) => {
	res.render('auth/login', {
		docTitle: 'Login',
		pageSubtitle: 'Enter details to log in',
		forms: forms,
		path: '/login',
	});
};

module.exports = { getLoginPage };
