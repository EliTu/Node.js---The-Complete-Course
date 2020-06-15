const express = require('express');

const router = express.Router();
const users = [];

router.get('/', (_, res) => res.render('index', {
	pageTitle: 'Main page'
}));
router.post('/', (req, res) => {
	users.push(req.body.name);
	res.redirect('/admin/users');
});

module.exports = {
	router: router,
	users: users,
};