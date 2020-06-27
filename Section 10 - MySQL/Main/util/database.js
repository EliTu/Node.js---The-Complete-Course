const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    userName: 'admin',
    database: 'node-complete',
    password: 'Eliad@1991'
});

module.exports = pool.promise();