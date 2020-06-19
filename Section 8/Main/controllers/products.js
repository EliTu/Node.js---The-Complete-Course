 const Product = require('../models/product');
 const forms = [{
     name: "title",
     type: "text",
     title: "Title",
 }, ];

 // Specific for '/admin/...':
 const getAddProduct = (_, res) => {
     res.render("admin/add-product", {
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
     product.saveProduct();

     res.redirect("/");
 }

 const getAdminProduct = (_, res) => {
     res.render('admin/admin-products', {
         docTitle: 'Admin Products',
         path: '/admin/admin-products'
     })
 }

 //  Specific for '/':
 const getAllProducts = (_, res) => {
     const fetchCallback = products => {
         res.render("shop/product-list", {
             docTitle: "Product List",
             products: products,
             path: "/",
             hasProducts: products.length,
             productsActive: true,
             productCSS: true,
         });
     }
     Product.fetchAll(fetchCallback);
 }

 module.exports = {
     getAddProduct,
     postNewProduct,
     getAdminProduct,
     getAllProducts
 }