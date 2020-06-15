const express = require("express");
const router = express.Router();

// Controller import
const {
    getAddProduct,
    postNewProduct
} = require('../controllers/products');

// /admin/add-product => GET
router.get("/add-product", getAddProduct);

// /admin/add-product => POST
router.post("/add-product", postNewProduct);

module.exports = router;