const express = require("express");

const router = express.Router();

const {
    getAllProducts
} = require('../controllers/products');

router.get("/", getAllProducts);
router.get('/products');
router.get('/cart');

module.exports = router;