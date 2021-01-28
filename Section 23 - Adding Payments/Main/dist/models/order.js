"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const orderSchema = new Schema({
    products: [
        {
            product: { type: Object, required: true },
            quantity: { type: Number, required: true },
        },
    ],
    user: {
        email: { type: String, required: true, trim: true },
        userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    },
});
exports.default = mongoose_1.default.model('Order', orderSchema);
//# sourceMappingURL=order.js.map