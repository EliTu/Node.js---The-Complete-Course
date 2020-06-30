const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('node-complete', 'admin', 'Eliad@1991', {
	dialect: 'mysql',
	host: 'localhost',
});

module.exports = sequelize;
