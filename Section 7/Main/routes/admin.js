const express = require("express");
const path = require("path");
const router = express.Router();

const rootDir = require("../util/path");

const products = [];
const forms = [{
    name: "title",
    type: "text",
    title: "Title",
}, ];

// /admin/add-product => GET
router.get("/add-product", (req, res) => {
    res.render("add-product", {
        docTitle: "Add Product",
        forms: forms,
        path: "/admin/add-product",
        hasForms: forms.length,
        formsActive: true,
        formsCSS: true,
    });
});

// /admin/add-product => POST
router.post("/add-product", (req, res) => {
    console.log(req.body.title);

    products.push({
        title: req.body.title,
    });

    res.redirect("/");
});

exports.route = router;
exports.products = products;