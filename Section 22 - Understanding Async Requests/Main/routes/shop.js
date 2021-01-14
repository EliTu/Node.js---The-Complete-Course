const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/isAuthenticated');

const {
	getIndexPage,
	getProductList,
	getProductDetailsPage,
	getCartPage,
	getOrdersPage,
	getCheckoutPage,
	getOrderInvoice,
	postCart,
	postCartDeleteProduct,
	postOrder,
} = require('../controllers/shopController');

/* the middleware parse the arguments from left to right, so we can add as many middlewares, like isAuthenticated, before the final resolving function as we like*/

router.get('/', getIndexPage);
router.get('/products', getProductList);
router.get('/products/:productId', getProductDetailsPage);
router.get('/cart', isAuthenticated, getCartPage);
router.get('/orders', isAuthenticated, getOrdersPage);
router.get('/orders/:orderId', isAuthenticated, getOrderInvoice);
router.get('/checkout', isAuthenticated, getCheckoutPage);

router.post('/cart', isAuthenticated, postCart);
router.post('/cart-delete-product', isAuthenticated, postCartDeleteProduct);
router.post('/create-order', isAuthenticated, postOrder);

module.exports = router;
