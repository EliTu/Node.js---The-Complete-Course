 const Product = require('../models/product');

 //  Specific for shop or '/':
 const getShopPage = (_, res) => {
     res.render('shop/index', {
         docTitle: 'Shop Main Page',
         pageSubtitle: 'Welcome to the shop',
         path: '/'
     })
 }

 const getOrdersPage = (_, res) => {
     res.render('shop/orders', {
         docTitle: 'Orders',
         pageSubtitle: 'Your Orders',
         path: '/orders'
     })
 }

 const getCart = (_, res) => {
     res.render('shop/cart', {
         docTitle: 'Cart',
         pageSubtitle: 'Your Cart',
         path: '/cart'
     })
 }

 const getCheckoutPage = (_, res) => {
     res.render('shop/checkout', {
         docTitle: 'checkout',
         pageSubtitle: 'Checkout',
         path: '/checkout'
     })
 }

 const getAllProducts = (_, res) => {
     const fetchCallback = products => {
         res.render("shop/product-list", {
             docTitle: "Product List",
             pageSubtitle: 'Available Products',
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