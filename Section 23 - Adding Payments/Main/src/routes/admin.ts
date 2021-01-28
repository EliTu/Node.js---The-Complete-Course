import express from 'express';
import isAuthenticated from '../middleware/isAuthenticated';
import { postProductValidation } from '../util/validations';

const router = express.Router();

// Controller import
import {
	getAddProduct,
	getAdminProduct,
	getEditProduct,
	postProduct,
	deleteProduct,
} from '../controllers/adminController';

/* the middleware parse the arguments from left to right, so we can add as many middlewares, like isAuthenticated, before the final resolving function as we like*/

// /admin/add-product => GET
router.get('/add-product', isAuthenticated, getAddProduct);
router.get('/admin-products', isAuthenticated, getAdminProduct);
router.get('/edit-product/:productId', isAuthenticated, getEditProduct);

// /admin/add-product => POST
router.post(
	'/add-product',
	isAuthenticated,
	postProductValidation,
	postProduct
);
router.post(
	'/edit-product',
	isAuthenticated,
	postProductValidation,
	postProduct
);

// Using async request (and not form action)
router.delete('/product/:productId', isAuthenticated, deleteProduct);

export default router;
