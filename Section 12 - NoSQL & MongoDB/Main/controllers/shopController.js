const Product = require('../models/product.js');
const User = require('../models/user.js');

//  Specific for shop or '/':
const getShopPage = (_, res) => {
	res.render('shop/index', {
		docTitle: 'Shop Main Page',
		pageSubtitle: 'Welcome to the shop',
		path: '/',
	});
};

const getOrdersPage = async (req, res) => {
	try {
		const orders = await req.user.getOrders({ include: ['products'] });

		res.render('shop/orders', {
			docTitle: 'Orders',
			pageSubtitle: 'Your Orders',
			path: '/orders',
			orders: orders,
		});
	} catch (error) {
		console.log(error);
	}
};

const getCartPage = async (req, res) => {
	try {
		const cartProducts = await req.user.getCart();

		const priceCalc = +cartProducts
			.reduce((a, c) => a + +c.price * +c.quantity, 0)
			.toFixed(2);

		res.render('shop/cart', {
			docTitle: 'Cart',
			pageSubtitle: 'Your Cart',
			path: '/cart',
			cartProducts: cartProducts,
			totalPrice: priceCalc,
		});
	} catch (error) {
		console.log(error);
	}
};

const postCart = async (req, res) => {
	const prodId = req.body.productId;

	try {
		const product = await Product.findProductById(prodId);
		await req.user.addToCart(product);

		res.redirect('/cart');
	} catch (error) {
		console.log(error);
	}
};

const postCartDeleteProduct = async (req, res) => {
	const { cartDeleteId: id, isDeleteAll: isDeleteAll } = req.body;

	try {
		await req.user.deleteCartItem(id, isDeleteAll);
		res.redirect('/cart');
	} catch (error) {
		console.log(error);
	}
};

const getCheckoutPage = (_, res) => {
	res.render('shop/checkout', {
		docTitle: 'Checkout',
		pageSubtitle: 'Checkout',
		path: '/checkout',
	});
};

const getAllProducts = async (_, res) => {
	try {
		const products = await Product.fetchAllProducts();
		res.render('shop/product-list', {
			docTitle: 'Product List',
			pageSubtitle: 'Available Products',
			products: products,
			path: '/products',
			hasProducts: products.length,
			productsActive: true,
			productCSS: true,
		});
	} catch (error) {
		console.log(error);
	}
};

const getProductDetailsPage = async (req, res) => {
	const productId = req.params.productId;
	try {
		const product = await Product.findProductById(productId);
		console.log(product);

		res.render('shop/product-details', {
			docTitle: `Product: ${product.title}`,
			pageSubtitle: 'Product Details',
			product: product,
			path: '/products',
		});
	} catch (error) {
		console.log(error);
	}
};



const postOrder = async (req, res) => {
	try {
		await req.user.addOrder();

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
