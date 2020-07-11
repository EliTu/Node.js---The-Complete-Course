const { getDb } = require('../util/database');
const mongodb = require('mongodb');
class Product {
	constructor(title, price, description, imageUrl, id) {
		(this.title = title),
			(this.price = price),
			(this.description = description),
			(this.imageUrl = !imageUrl
				? `https://loremflickr.com/320/240/taiwan?random=${
						Math.floor(Math.random() * (45 - 1)) + 1
				  }`
				: imageUrl);
		this._id = id;
	}

	async save() {
		const db = getDb();
		if (!this._id) {
			// Insert (create a new one)
			try {
				const res = await db.collection('products').insertOne(this);
				return res;
			} catch (error) {
				console.log(error);
			}
		} else {
			// Update
			try {
				const res = await db.collection('products').updateOne(
					{ _id: new mongodb.ObjectId(this._id) },
					{
						$set: this,
					}
				);
				return res;
			} catch (error) {
				console.log(error);
			}
		}
	}

	static async fetchAllProducts() {
		const db = getDb();
		try {
			const product = await db.collection('products').find().toArray();
			return product;
		} catch (error) {
			console.log(error);
		}
	}

	static async findProductById(prodId) {
		const db = getDb();
		try {
			const res = await db
				.collection('products')
				.find({ _id: new mongodb.ObjectId(prodId) })
				.next();
			return res;
		} catch (error) {
			console.log(error);
		}
	}
}

module.exports = Product;
