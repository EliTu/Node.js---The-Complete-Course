const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/isAuthenticated');
const { postProductValidation } = require('../util/validations');

// Controller import
const {
	getAddProduct,
	getAdminProduct,
	getEditProduct,
	postProduct,
	postDeleteProduct,
} = require('../controllers/adminController');

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
router.post('/edit-product', isAuthenticated, postProduct);
router.post('/delete-product', isAuthenticated, postDeleteProduct);

module.exports = router;
