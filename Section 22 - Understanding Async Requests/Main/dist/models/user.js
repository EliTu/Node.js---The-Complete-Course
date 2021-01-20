"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const userSchema = new Schema({
    email: {
        type: String,
        trim: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 4,
    },
    resetPasswordToken: {
        type: String,
        trim: true,
    },
    resetPasswordTokenExpiration: {
        type: Date,
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
/**
 * A custom method for the User model for adding new items to the user's cart. Will set the items array and quantity.
 * @param {*} product The product object that is requested to be added.
 */
userSchema.methods.addToCart = function (product) {
    const cartProductIndex = this.cart.items.findIndex((el) => el.productId ? el.productId.toString() === product._id.toString() : null);
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];
    let updatedCart;
    // If cartProduct yields -1 index, set a new cart with product
    if (cartProductIndex === -1) {
        updatedCartItems.push({
            productId: product._id,
            quantity: newQuantity,
        });
    }
    else {
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
/**
 * A custom method for the User model to remove items from the cart, either a single item or a whole bunch of items.
 * @param {*} productId The id of the item that is requested to be removed.
 * @param {*} isDeleteAll A flag to indicate if the remove request is for the entire item and its quantity. If false, will remove a single item (quantity -1).
 */
userSchema.methods.removeFromCart = function (productId, isDeleteAll) {
    let updatedCartItems;
    if (isDeleteAll) {
        updatedCartItems = this.cart.items.filter((item) => item.productId.toString() !== productId.toString());
    }
    else {
        updatedCartItems = this.cart.items.map((item) => item.productId.toString() === productId.toString()
            ? { productId: item.productId, quantity: item.quantity - 1 }
            : item);
    }
    this.cart.items = updatedCartItems;
    return this.save();
};
/**
 * a custom method for the User model to reset the cart to an empty state.
 */
userSchema.methods.clearCart = function () {
    this.cart = { items: [] };
    return this.save();
};
exports.default = mongoose_1.default.model('User', userSchema);
//# sourceMappingURL=user.js.map