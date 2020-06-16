 const Product = require('../models/product');
 const forms = [{
     name: "title",
     type: "text",
     title: "Title",
 }, ];

 // Specific for '/admin/...':
 const getAddProduct = (req, res) => {
     res.render("add-product", {
         docTitle: "Add Product",
         forms: forms,
         path: "/admin/add-product",
         hasForms: forms.length,
         formsActive: true,
         formsCSS: true,
     });
 }

 const postNewProduct = (req, res) => {
     const product = new Product(req.body.title);
     product.save();

     res.redirect("/");
 }

 //  Specific for '/':
 const getAllProducts = (req, res) => {
     Product.fetchAll((products) => {
         res.render("shop", {
             docTitle: "Shop",
             products: products,
             path: "/admin/shop",
             hasProducts: products.length,
             productsActive: true,
             productCSS: true,
         });
     });
 }

 module.exports = {
     getAddProduct,
     postNewProduct,
     getAllProducts
 }