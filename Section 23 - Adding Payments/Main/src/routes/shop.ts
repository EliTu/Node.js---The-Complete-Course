import express from 'express';
import isAuthenticated from '../middleware/isAuthenticated';

import {
	getIndexPage,
	getProductList,
	getProductDetailsPage,
	getCartPage,
	getOrdersPage,
	getCheckoutPage,
	getOrderInvoice,
	postCart,
	postCartDeleteProduct,
	getCheckoutSuccess,
} from '../controllers/shopController';

const router = express.Router();
/* the middleware parse the arguments from left to right, so we can add as many middlewares, like isAuthenticated, before the final resolving function as we like*/

router.get('/', getIndexPage);
router.get('/products', getProductList);
router.get('/products/:productId', getProductDetailsPage);
router.get('/cart', isAuthenticated, getCartPage);
router.get('/checkout', isAuthenticated, getCheckoutPage);
router.get('/checkout/success', isAuthenticated, getCheckoutSuccess);
router.get('/checkout/cancel', isAuthenticated, getCheckoutPage);
router.get('/orders', isAuthenticated, getOrdersPage);
router.get('/orders/:orderId', isAuthenticated, getOrderInvoice);

router.post('/cart', isAuthenticated, postCart);
router.post('/cart-delete-product', isAuthenticated, postCartDeleteProduct);

export default router;
