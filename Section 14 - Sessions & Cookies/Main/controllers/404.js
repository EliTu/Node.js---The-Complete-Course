const getPageNotFound = (req, res) => {
	const { isLoggedIn } = req.session.loginData;
	res.status(404).render('404', {
		docTitle: 'Page not found!',
		path: '/404',
		isLoggedIn: isLoggedIn && isLoggedIn,
	});
};

module.exports = {
	getPageNotFound,
};
