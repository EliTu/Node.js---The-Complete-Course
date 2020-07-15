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

	async getCart() {
		const db = getDb();
		const productIds = this.cart.items.map((item) => item.productId);
		const cartProducts = await db
			.collection('products')
			.find({ _id: { $in: productIds } })
			.toArray();

		return cartProducts.map((product) => {
			return {
				...product,
				quantity: this.cart.items.find(
					(item) => item.productId.toString() === product._id.toString()
				).quantity,
			};
		});
	}

	addToCart(product) {
		const cartProductIndex = this.cart.items.findIndex((el) =>
			el.productId ? el.productId.toString() === product._id.toString() : null
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

	deleteCartItem(productId, isDeleteAll) {
		let updatedCartItems;

		if (isDeleteAll) {
			updatedCartItems = this.cart.items.filter(
				(item) => item.productId.toString() !== productId.toString()
			);
		} else {
			updatedCartItems = this.cart.items.map((item) =>
				item.productId.toString() === productId.toString()
					? { ...item, quantity: item.quantity - 1 }
					: item
			);
		}

		const db = getDb();
		return db
			.collection('users')
			.updateOne(
				{ _id: new mongodb.ObjectId(this._id) },
				{ $set: { cart: { items: updatedCartItems } } }
			);
	}
}

module.exports = User;
