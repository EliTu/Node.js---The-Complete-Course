import { ProductModel } from '../models/product';

/**
 * Type guard to check and confirm that a specific object is compatible with the ProductModel.
 * Good use case is after calling mongoose's .populate() or .execPopulate() to type the result correctly.
 * @param obj the object we're checking.
 */
export const isProduct = (obj: ProductModel | any): obj is ProductModel => {
	return obj && obj.title && typeof obj.title === 'string';
};
