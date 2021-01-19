import mongoose, { Document } from 'mongoose';
import { ProductModel } from './product';
import { BaseModel } from './user';

const Schema = mongoose.Schema;

export type Products = { product: ProductModel; quantity: number }[];
export interface OrderModel extends Document {
	products: Products;
	user: {
		email: string;
		userId: BaseModel['_id'];
	};
}

const orderSchema = new Schema<OrderModel>({
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

export default mongoose.model<OrderModel>('Order', orderSchema);
