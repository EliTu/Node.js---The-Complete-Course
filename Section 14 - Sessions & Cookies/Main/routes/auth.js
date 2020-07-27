const express = require('express');
const router = express.Router();

const { getLoginPage } = require('../controllers/auth');

router.get('/login', getLoginPage);

module.exports = router;
