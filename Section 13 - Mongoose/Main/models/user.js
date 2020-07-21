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

module.exports = mongoose.model('User', userSchema);
