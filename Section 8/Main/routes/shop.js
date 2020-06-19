const express = require("express");

const router = express.Router();

const {
    getAllProducts,
    getShopPage,
    getCart,
    getCheckoutPage
} = require('../controllers/shopController');

router.get("/", getShopPage);
router.get('/products', getAllProducts);
router.get('/cart', getCart);
router.get('/checkout', getCheckoutPage);

module.exports = router;