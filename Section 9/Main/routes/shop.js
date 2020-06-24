const express = require("express");

const router = express.Router();

const {
    getAllProducts,
    getProductDetailsPage,
    getShopPage,
    getCartPage,
    getOrdersPage,
    getCheckoutPage,
    postCart
} = require('../controllers/shopController');

router.get("/", getShopPage);
router.get('/products', getAllProducts);
router.get('/products/:productId', getProductDetailsPage);
router.get('/cart', getCartPage);
router.get('/orders', getOrdersPage);
router.get('/checkout', getCheckoutPage);

router.post('/cart', postCart);

module.exports = router;