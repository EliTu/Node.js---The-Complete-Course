const fs = require('fs');
const path = require('path');
const Product = require('../models/product.js');
const Order = require('../models/order');
const setUserMessage = require('../util/setUserMessage');
const setErrorMiddlewareObject = require('../util/setErrorMiddlewareObject');

//  Specific for shop or '/':
const getShopPage = (req, res) => {
	res.render('shop/index', {
		docTitle: 'Shop Main Page',
		pageSubtitle: 'Welcome to the shop',
		path: '/',
		success: setUserMessage(req.flash('success')),
		error: setUserMessage(req.flash('error')),
	});
};

const getOrdersPage = async (req, res, next) => {
	try {
		const orders = await Order.find({ 'user.userId': req.session.user._id });
		res.render('shop/orders', {
			docTitle: 'Orders',
			pageSubtitle: 'Your Orders',
			path: '/orders',
			orders: orders,
			success: setUserMessage(req.flash('success')),
		});
	} catch (error) {
		setErrorMiddlewareObject(error, next);
	}
};

const getOrderInvoice = async (req, res, next) => {
	const orderId = req.params.orderId;
	const invoiceFileName = `invoice-${orderId}.pdf`;
	const invoicePath = path.join('assets', 'invoices', invoiceFileName); // construct a path to the relevant invoice

	// use the file system module to read the file and serve it
	fs.readFile(invoicePath, (err, data) => {
		if (err) return next(err); // if error, pass it to the error middleware

		res.send(data);
	});
};

const getCartPage = async (req, res, next) => {
	try {
		const userCart = await req.user
			.populate('cart.items.productId')
			.execPopulate();
		const cartProducts = [...userCart.cart.items];
		const priceCalc = +cartProducts
			.reduce((a, c) => a + +c.productId.price * +c.quantity, 0)
			.toFixed(2);

		res.render('shop/cart', {
			docTitle: 'Cart',
			pageSubtitle: 'Your Cart',
			path: '/cart',
			cartProducts: cartProducts,
			totalPrice: priceCalc,
			success: setUserMessage(req.flash('success')),
		});
	} catch (error) {
		setErrorMiddlewareObject(error, next);
	}
};

const postCart = async (req, res, next) => {
	const prodId = req.body.cartAddId;

	try {
		const product = await Product.findById(prodId);
		await req.user.addToCart(product);

		req.flash('success', `${product.title} has been added to the cart`);
		res.redirect('/cart');
	} catch (error) {
		setErrorMiddlewareObject(error, next);
	}
};

const postCartDeleteProduct = async (req, res, next) => {
	const { isDeleteAll, cardDeleteProductName: productTitle } = req.body;

	try {
		await req.user.removeFromCart(5, isDeleteAll);
		req.flash('success', `${productTitle} has been removed from the cart`);
	} catch (error) {
		// req.flash(
		// 	'error',
		// 	`Something went wrong! ${productTitle} wasn't removed successfully`
		// ); // TODO: figure out how to handle unsuccessful removal inside the try block
		setErrorMiddlewareObject(error, next);
	} finally {
		res.redirect('/cart');
	}
};

const getCheckoutPage = (req, res) => {
	res.render('shop/checkout', {
		docTitle: 'Checkout',
		pageSubtitle: 'Checkout',
		path: '/checkout',
	});
};

const getAllProducts = async (req, res, next) => {
	try {
		const products = await Product.find();
		res.render('shop/product-list', {
			docTitle: 'Product List',
			pageSubtitle: 'Available Products',
			products: products,
			path: '/products',
			hasProducts: products.length,
			productsActive: true,
			productCSS: true,
			success: setUserMessage(req.flash('success')),
		});
	} catch (error) {
		setErrorMiddlewareObject(error, next);
	}
};

const getProductDetailsPage = async (req, res, next) => {
	const productId = req.params.productId;
	try {
		const product = await Product.findById(productId);

		res.render('shop/product-details', {
			docTitle: `Product: ${product.title}`,
			pageSubtitle: 'Product Details',
			product: product,
			path: '/products',
		});
	} catch (error) {
		setErrorMiddlewareObject(error, next);
	}
};

const postOrder = async (req, res, next) => {
	try {
		const cartProductsData = await req.user
			.populate('cart.items.productId')
			.execPopulate();

		const products = [...cartProductsData.cart.items].map((item) => {
			return { quantity: item.quantity, product: { ...item.productId._doc } };
		});

		const order = new Order({
			products: products,
			user: {
				email: req.user.email,
				userId: req.user,
			},
		});
		await order.save();
		await req.user.clearCart();

		req.flash('success', `Order ${order._id} has been made successfully`);
		res.redirect('/orders');
	} catch (error) {
		setErrorMiddlewareObject(error, next);
	}
};

module.exports = {
	getAllProducts,
	getProductDetailsPage,
	getShopPage,
	getCartPage,
	getOrdersPage,
	getOrderInvoice,
	getCheckoutPage,
	postCart,
	postCartDeleteProduct,
	postOrder,
};
