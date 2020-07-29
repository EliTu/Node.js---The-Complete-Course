const express = require('express');
const router = express.Router();

const { getLoginPage, postLogin } = require('../controllers/authController');

router.get('/login', getLoginPage);

router.post('/login', postLogin);

module.exports = router;
