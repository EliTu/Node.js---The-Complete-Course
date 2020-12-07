const express = require('express');
const router = express.Router();

const {
	getLoginPage,
	postLogin,
	postLogout,
} = require('../controllers/authController');

router.get('/login', getLoginPage);

router.post('/login', postLogin);
router.post('/logout', postLogout);

module.exports = router;
