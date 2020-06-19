const express = require("express");
const router = express.Router();

// Controller import
const {
    getAddProduct,
    getAdminProduct,
    postNewProduct
} = require('../controllers/products');

// /admin/add-product => GET
router.get("/add-product", getAddProduct);
router.get('/admin-products', getAdminProduct);

// /admin/add-product => POST
router.post("/add-product", postNewProduct);

module.exports = router;