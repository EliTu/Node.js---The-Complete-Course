const express = require('express');
const path = require('path');

const router = express.Router();

const rootDir = require('../utils/path');

router.get('/', (req, res) => {
    res.sendFile(path.join(rootDir, 'views', 'index.html'));
})

module.exports = router;