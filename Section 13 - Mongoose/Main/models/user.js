const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const userSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	cart: {
		items: [
			{
				productId: {
					type: Schema.Types.ObjectId,
					ref: 'Product',
					required: true,
				},
				quantity: { type: Number, required: true },
			},
		],
	},
});

userSchema.methods.addToCart = function (product) {
	const cartProductIndex = this.cart.items.findIndex((el) =>
		el.productId ? el.productId.toString() === product._id.toString() : null
	);
	let newQuantity = 1;
	const updatedCartItems = [...this.cart.items];
	let updatedCart;

	// If cartProduct yields -1 index, set a new cart with product
	if (cartProductIndex === -1) {
		updatedCartItems.push({
			productId: product._id,
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

	this.cart = updatedCart;

	return this.save();
};

userSchema.methods.removeFromCart = function (productId, isDeleteAll) {
	let updatedCartItems;

	if (isDeleteAll) {
		updatedCartItems = this.cart.items.filter(
			(item) => item.productId.toString() !== productId.toString()
		);
	} else {
		updatedCartItems = this.cart.items.map((item) =>
			item.productId.toString() === productId.toString()
				? { productId: item.productId, quantity: item.quantity - 1 }
				: item
		);
	}

	this.cart.items = updatedCartItems;

	return this.save();
};

userSchema.methods.clearCart = function () {
	this.cart = { items: [] };
	return this.save();
};

module.exports = mongoose.model('User', userSchema);
