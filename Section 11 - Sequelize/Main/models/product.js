// const fs = require('fs');
// // const path = require('path');

// // const filePath = path.join(
// //     path.dirname(process.mainModule.filename),
// //     'data',
// //     'products.json'
// // );
// const db = require('../util/database');

// const Cart = require('./cart');

// // const getProductsFromFIle = action => {
// //     fs.readFile(filePath, (err, content) => {
// //         if (err) return action([]);
// //         else return action(JSON.parse(content));
// //     });
// // }

// class Product {
// 	constructor(title, imageUrl, price, description, id) {
// 		this.title = title;
// 		this.imageUrl = !imageUrl
// 			? `https://loremflickr.com/320/240/taiwan?random=${
// 					Math.floor(Math.random() * (45 - 1)) + 1
// 			  }`
// 			: imageUrl;
// 		this.price = price;
// 		this.description = description;
// 		this.id = id;
// 	}

// 	saveProduct() {
// 		return db.execute(
// 			'INSERT INTO products (title, price, description, imageUrl) VALUES (?, ?, ?, ?)',
// 			[this.title, this.price, this.description, this.imageUrl]
// 		);
// 	}

// 	static fetchAll() {
// 		// getProductsFromFIle(fetchProductsCallback);
// 		return db.execute('SELECT * FROM products');
// 	}

// 	static findProductById(id) {
// 		return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
// 	}

// 	static deleteProduct(id) {
// 		const deleteProductCallback = (products) => {
// 			const { price } = products.find((prod) => prod.id === id);

// 			const updatedProductList = products.filter(
// 				(product) => product.id !== id
// 			);

// 			fs.writeFile(filePath, JSON.stringify(updatedProductList), (e) => {
// 				if (!e) {
// 					Cart.deleteProduct(id, price);
// 				}
// 			});
// 		};
// 		getProductsFromFIle(deleteProductCallback);
// 	}
// }

const Sequelize = require('sequelize');

const sequelizePool = require('../util/database');

const Product = sequelizePool.define('product', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	title: Sequelize.STRING,
	price: {
		type: Sequelize.DOUBLE,
		allowNull: false,
	},
	imageUrl: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	description: {
		type: Sequelize.STRING,
		allowNull: false,
	},
});

module.exports = Product;
