import mongoose, { Document } from 'mongoose';

import { IUserModel } from './user';

const Schema = mongoose.Schema;

export interface IProductModel extends Document {
	title: string;
	price: number;
	description: string;
	imageUrl: string;
	userId: IUserModel['_id'];
}

const productSchema = new Schema({
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

export default mongoose.model<IProductModel>('Product', productSchema);
