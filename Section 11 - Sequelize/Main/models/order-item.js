const Sequelize = require('sequelize');
const sequelizePool = require('../util/database');

const OrderItem = sequelizePool.define('orderItem', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	quantity: Sequelize.INTEGER,
});

module.exports = OrderItem;
