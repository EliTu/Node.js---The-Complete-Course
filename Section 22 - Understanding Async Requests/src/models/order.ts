import mongoose, { Document } from 'mongoose';
import { IProductModel } from './product';
import { IUserModel } from './user';

const Schema = mongoose.Schema;

type Products = { product: IProductModel; quantity: number }[];
export interface IOrderModel extends Document {
	products: Products;
	user: IUserModel['_id'];
}

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

export default mongoose.model<IOrderModel>('Order', orderSchema);
