const express = require("express");
const path = require("path");

const adminData = require("./admin");

const router = express.Router();

const rootDir = require("../util/path");

router.get("/", (req, res, next) => {
    const {
        products
    } = adminData;

    res.render("shop", {
        products: products,
        docTitle: "Shop",
        path: "/admin/shop",
        hasProducts: products.length,
        productsActive: true,
        productCSS: true,
    });
});

module.exports = router;