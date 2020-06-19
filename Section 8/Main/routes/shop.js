const express = require("express");

const router = express.Router();

const {
    getAllProducts,
    getShopPage,
    getCheckoutPage
} = require('../controllers/shopController');

router.get("/", getShopPage);
router.get('/products', getAllProducts);
router.get('/checkout', getCheckoutPage);

module.exports = router;