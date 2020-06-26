const express = require("express");
const router = express.Router();

// Controller import
const {
    getAddProduct,
    getAdminProduct,
    getEditProduct,
    postNewProduct,
    postEditProduct
} = require('../controllers/adminController');

// /admin/add-product => GET
router.get('/add-product', getAddProduct);
router.get('/admin-products', getAdminProduct);
router.get('/edit-product/:productId', getEditProduct);

// /admin/add-product => POST
router.post('/add-product', postNewProduct);
router.post('/edit-product', postEditProduct);

module.exports = router;