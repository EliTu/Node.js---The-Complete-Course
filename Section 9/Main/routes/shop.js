const express = require("express");

const router = express.Router();

const {
    getAllProducts,
    getShopPage,
    getCart,
    getOrdersPage,
    getCheckoutPage
} = require('../controllers/shopController');

router.get("/", getShopPage);
router.get('/products', getAllProducts);
router.get('/cart', getCart);
router.get('/orders', getOrdersPage);
router.get('/checkout', getCheckoutPage);

module.exports = router;