const express = require('express');
const router = express.Router();

const { getLoginPage } = require('../controllers/authController');

router.get('/login', getLoginPage);

module.exports = router;
