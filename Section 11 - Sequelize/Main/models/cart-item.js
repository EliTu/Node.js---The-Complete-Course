const Sequelize = require('sequelize');
const sequelizePool = require('../util/database');

const CartItem = sequelizePool.define('cartItem', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	quantity: Sequelize.INTEGER,
});

module.exports = CartItem;
