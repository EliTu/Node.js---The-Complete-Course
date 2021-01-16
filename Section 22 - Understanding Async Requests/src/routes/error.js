const express = require('express');
const router = express.Router();
const { get500ErrorPage } = require('../controllers/errorController');

router.get('/500', get500ErrorPage);

module.exports = router;
