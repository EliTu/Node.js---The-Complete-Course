const express = require('express');

const router = express.Router();
const mainData = require('./index');

router.get('/users', (_, res) => {
    res.render('users', {
        userList: mainData.users,
        pageTitle: 'Users page'
    });
});

module.exports = router;