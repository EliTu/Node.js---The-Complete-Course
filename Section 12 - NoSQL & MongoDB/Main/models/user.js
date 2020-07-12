const { getDb } = require('../util/database');
const mongodb = require('mongodb');
class User {
	constructor(username, email, cart, id) {
		this.username = username;
		this.email = email;
		this.cart = cart;
		this._id = new mongodb.ObjectId(id);
	}

	save() {
		const db = getDb();
		const res = db.collection('users').insertOne(this);
		return res;
	}

	static findUserById(userId) {
		const db = getDb();

		const res = db
			.collection('users')
			.findOne({ _id: new mongodb.ObjectId(userId) });
		return res;
	}

	addToCart(product) {
		const cartProduct = this.cart.items.findIndex(
			(el) => el._id === product._id
		);
		if (!cartProduct) {
			const updatedCart = { items: [{ ...product, quantity: 1 }] };
			const db = getDb();

			const res = db
				.collection('users')
				.updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
			return res;
		}
	}
}

module.exports = User;
