 const Product = require('../models/product');
 const forms = [{
     name: "title",
     type: "text",
     title: "Title",
 }, ];

 //  Specific for shop or '/':
 const getShopPage = (_, res) => {
     res.render('shop/index', {
         docTitle: 'Shop Main Page',
         path: '/'
     })
 }

 const getOrdersPage = (_, res) => {
     res.render('shop/orders', {
         docTitle: 'Orders',
         path: '/orders'
     })
 }

 const getCart = (_, res) => {
     res.render('shop/cart', {
         docTitle: 'Cart',
         path: '/cart'
     })
 }

 const getCheckoutPage = (_, res) => {
     res.render('shop/checkout', {
         docTitle: 'checkout',
         path: '/checkout'
     })
 }

 const getAllProducts = (_, res) => {
     const fetchCallback = products => {
         res.render("shop/product-list", {
             docTitle: "Product List",
             products: products,
             path: "/products",
             hasProducts: products.length,
             productsActive: true,
             productCSS: true,
         });
     }
     Product.fetchAll(fetchCallback);
 }

 module.exports = {
     getAllProducts,
     getShopPage,
     getCart,
     getOrdersPage,
     getCheckoutPage,
 }