const Sequelize = require('sequelize');
const sequelizePool = require('../util/database');

const Order = sequelizePool.define('order', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
});

module.exports = Order;
