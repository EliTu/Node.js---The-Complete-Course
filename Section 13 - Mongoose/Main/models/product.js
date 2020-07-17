// // const { getDb } = require('../util/database');
// const mongodb = require('mongodb');
// class Product {
// 	constructor(title, price, description, imageUrl, productId, userId) {
// 		(this.title = title),
// 			(this.price = price),
// 			(this.description = description),
// 			(this.imageUrl = !imageUrl
// 				? `https://loremflickr.com/320/240/taiwan?random=${
// 						Math.floor(Math.random() * (45 - 1)) + 1
// 				  }`
// 				: imageUrl);
// 		this._id = productId ? new mongodb.ObjectId(productId) : null;
// 		this.userId = userId ? new mongodb.ObjectId(userId) : null;
// 	}

// 	save() {
// 		const db = getDb();
// 		if (!this._id) {
// 			// Insert (create a new one)
// 			const res = db.collection('products').insertOne(this);
// 			return res;
// 		} else {
// 			// Update
// 			const res = db.collection('products').updateOne(
// 				{ _id: this._id },
// 				{
// 					$set: this,
// 				}
// 			);
// 			return res;
// 		}
// 	}

// 	static fetchAllProducts() {
// 		const db = getDb();

// 		const product = db.collection('products').find().toArray();
// 		return product;
// 	}

// 	static async findProductById(prodId) {
// 		const db = getDb();

// 		const res = db
// 			.collection('products')
// 			.find({ _id: new mongodb.ObjectId(prodId) })
// 			.next();
// 		return res;
// 	}

// 	static deleteById(prodId) {
// 		const db = getDb();

// 		const res = db
// 			.collection('products')
// 			.deleteOne({ _id: new mongodb.ObjectId(prodId) });
// 		return res;
// 	}
// }

// module.exports = Product;
