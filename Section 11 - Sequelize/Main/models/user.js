const Sequelize = require('sequelize');
const sequelizePool = require('../util/database');

const User = sequelizePool.define('user', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	name: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	email: Sequelize.STRING,
});

module.exports = User;
