import mongoose, { Document } from 'mongoose';

import { UserModel } from './user';

const Schema = mongoose.Schema;

export interface ProductModel extends Document {
	title: string;
	price: number;
	description: string;
	imageUrl: string;
	userId: UserModel['_id'];
}

const productSchema = new Schema<ProductModel>({
	title: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	imageUrl: {
		type: String,
		required: true,
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
});

export default mongoose.model<ProductModel>('Product', productSchema);
