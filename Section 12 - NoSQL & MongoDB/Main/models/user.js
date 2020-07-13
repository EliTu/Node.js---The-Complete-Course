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
		const cartProductIndex = this.cart.items.findIndex(
			(el) => el.productId.toString() === product._id.toString()
		);
		let newQuantity = 1;
		const updatedCartItems = [...this.cart.items];
		let updatedCart;
		const db = getDb();

		// If cartProduct yields -1 index, set a new cart with product
		if (cartProductIndex === -1) {
			updatedCartItems.push({
				productId: new mongodb.ObjectId(product._id),
				quantity: newQuantity,
			});
		} else {
			// else update the cart's item quantity
			newQuantity = this.cart.items[cartProductIndex].quantity + 1;
			updatedCartItems[cartProductIndex].quantity = newQuantity;
		}
		updatedCart = {
			items: updatedCartItems,
		};

		const res = db
			.collection('users')
			.updateOne({ _id: this._id }, { $set: { cart: updatedCart } });

		return res;
	}
}

module.exports = User;
