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

 const getCartPage = (_, res) => {
     res.render('shop/cart', {
         docTitle: 'Cart',
         pageSubtitle: 'Your Cart',
         path: '/cart'
     })
 }

 const postCart = (req, res) => {
     const prodId = req.body.productId;
     console.log(prodId);

     res.redirect('/cart');
 }

 const getCheckoutPage = (_, res) => {
     res.render('shop/checkout', {
         docTitle: 'Checkout',
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

 const getProductDetailsPage = (req, res) => {
     const productId = req.params.productId;
     const fetchProductCallback = product => {
         res.render('shop/product-details', {
             docTitle: `Product: ${product.title}`,
             pageSubtitle: 'Product Details',
             product: product,
             path: '/products'
         });
     }

     Product.findProductById(productId, fetchProductCallback);
 }

 module.exports = {
     getAllProducts,
     getProductDetailsPage,
     getShopPage,
     getCartPage,
     getOrdersPage,
     getCheckoutPage,
     postCart
 }