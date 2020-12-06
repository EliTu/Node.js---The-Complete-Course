const Product = require('../models/product.js');
const Order = require('../models/order');
const User = require('../models/user');

//  Specific for shop or '/':
const getShopPage = (req, res) => {
	res.render('shop/index', {
		docTitle: 'Shop Main Page',
		pageSubtitle: 'Welcome to the shop',
		path: '/',
		isLoggedIn: req.session.isLoggedIn,
	});
};

const getOrdersPage = async (req, res) => {
	try {
		const orders = await Order.find({ 'user.userId': req.session.user._id });
		res.render('shop/orders', {
			docTitle: 'Orders',
			pageSubtitle: 'Your Orders',
			path: '/orders',
			orders: orders,
			isLoggedIn: req.session.isLoggedIn,
		});
	} catch (error) {
		console.log(error);
	}
};

const getCartPage = async (req, res) => {
	const user = new User().init(req.session.user);
	try {
		const userCart = await user.populate('cart.items.productId').execPopulate();
		const cartProducts = [...userCart.cart.items];
		console.log(userCart);

		const priceCalc = +cartProducts
			.reduce((a, c) => a + +c.productId.price * +c.quantity, 0)
			.toFixed(2);

		res.render('shop/cart', {
			docTitle: 'Cart',
			pageSubtitle: 'Your Cart',
			path: '/cart',
			cartProducts: cartProducts,
			totalPrice: priceCalc,
			isLoggedIn: req.session.isLoggedIn,
		});
	} catch (error) {
		console.log(error);
	}
};

const postCart = async (req, res) => {
	const user = new User().init(req.session.user);
	const prodId = req.body.productId;

	try {
		const product = await Product.findById(prodId);
		await user.addToCart(product);

		res.redirect('/cart');
	} catch (error) {
		console.log(error);
	}
};

const postCartDeleteProduct = async (req, res) => {
	const user = new User().init(req.session.user);
	const { cartDeleteId: id, isDeleteAll: isDeleteAll } = req.body;

	try {
		await user.removeFromCart(id, isDeleteAll);
		res.redirect('/cart');
	} catch (error) {
		console.log(error);
	}
};

const getCheckoutPage = (req, res) => {
	res.render('shop/checkout', {
		docTitle: 'Checkout',
		pageSubtitle: 'Checkout',
		path: '/checkout',
		isLoggedIn: req.session.isLoggedIn,
	});
};

const getAllProducts = async (req, res) => {
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
			isLoggedIn: req.session.isLoggedIn,
		});
	} catch (error) {
		console.log(error);
	}
};

const getProductDetailsPage = async (req, res) => {
	const productId = req.params.productId;
	try {
		const product = await Product.findById(productId);

		res.render('shop/product-details', {
			docTitle: `Product: ${product.title}`,
			pageSubtitle: 'Product Details',
			product: product,
			path: '/products',
			isLoggedIn: req.session.isLoggedIn,
		});
	} catch (error) {
		console.log(error);
	}
};

const postOrder = async (req, res) => {
	const user = new User().init(req.session.user);
	try {
		const cartProductsData = await user
			.populate('cart.items.productId')
			.execPopulate();

		const products = [...cartProductsData.cart.items].map((item) => {
			return { quantity: item.quantity, product: { ...item.productId._doc } };
		});

		const order = new Order({
			products: products,
			user: {
				name: user.name,
				userId: user,
			},
		});
		await order.save();
		await user.clearCart();

		res.redirect('/orders');
	} catch (error) {
		console.log(error);
	}
};

module.exports = {
	getAllProducts,
	getProductDetailsPage,
	getShopPage,
	getCartPage,
	getOrdersPage,
	getCheckoutPage,
	postCart,
	postCartDeleteProduct,
	postOrder,
};
