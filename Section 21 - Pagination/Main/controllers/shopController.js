const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const Product = require('../models/product.js');
const Order = require('../models/order');
const setUserMessage = require('../util/setUserMessage');
const setErrorMiddlewareObject = require('../util/setErrorMiddlewareObject');

const ITEMS_PER_PAGE = 1;

//  Specific for shop or '/':
const getIndexPage = (req, res) => {
	res.render('shop/index', {
		docTitle: 'Shop Main Page',
		pageSubtitle: 'Welcome to the shop',
		path: '/',
		success: setUserMessage(req.flash('success')),
		error: setUserMessage(req.flash('error')),
	});
};

const getProductList = async (req, res, next) => {
	const page = +req.query.page || 1;
	try {
		const totalNumberOfProducts = await Product.countDocuments(); // count the amount documents in the products collection

		const products = await Product.find()
			.skip((page - 1) * ITEMS_PER_PAGE) // skip finding results based on current page and the limit of items
			.limit(ITEMS_PER_PAGE); // also limit the amount of data retrieved by the items per page value

		res.render('shop/product-list', {
			docTitle: 'Product List',
			pageSubtitle: 'Available Products',
			products,
			path: '/products',
			hasProducts: products.length,
			productsActive: true,
			productCSS: true,
			currentPage: page,
			hasNextPage: ITEMS_PER_PAGE * page < totalNumberOfProducts,
			hasPreviousPage: page > 1,
			nextPage: page + 1,
			previousPage: page - 1,
			lastPage: Math.ceil(totalNumberOfProducts / ITEMS_PER_PAGE),
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
	try {
		const order = await Order.findById(orderId);

		if (!order) return setErrorMiddlewareObject('No order found', next);
		if (order.user.userId.toString() !== req.user._id.toString())
			return setErrorMiddlewareObject('Unauthorized access attempt', next);

		const invoiceFileName = `invoice-${orderId}.pdf`;
		const invoicePath = path.join('assets', 'invoices', invoiceFileName); // construct a path to the relevant invoice

		const pdfDoc = new PDFDocument(); // create a new pdfkit instance which is a stream
		res.setHeader('Content-Type', 'application/pdf'); // set the response header to allow the browser handle and display the pdf file
		res.setHeader(
			'Content-Disposition',
			`inline; filename="${invoiceFileName}"`
		); // set the response header to make sure the pdf is displayed in the browser and has a file name

		pdfDoc.pipe(fs.createWriteStream(invoicePath)); // pipe it to a writable stream we can create with fs
		pdfDoc.pipe(res); // also pipe it to the res

		// populate the pdf with the relevant data
		pdfDoc
			.fontSize(20)
			.text(`Invoice for order ${orderId}`, {
				align: 'left',
			})
			.fontSize(16)
			.text(`To: ${req.user.email}`, {
				lineBreak: true,
				lineGap: 10,
			})
			.fontSize(16)
			.text(
				'---------------------------------------------------------------------------',
				{ lineGap: 20, lineBreak: true }
			)
			.fontSize(20)
			.text('Product details:', { lineGap: 10 });

		let totalPrice = 0;
		// Loop through all of the possible order products and create pdf texts for each and set the total price
		for (orderProdObj of order.products) {
			const { product, quantity } = orderProdObj;
			const { title, price, description } = product;
			totalPrice += quantity * price;

			pdfDoc
				.fontSize(16)
				.text(`Product name: ${title}`, { lineGap: 5, indent: 20 })
				.text(`Quantity: ${quantity}`, { lineGap: 5, indent: 20 })
				.text(`Product description: ${description}`, {
					lineGap: 30,
					indent: 20,
					lineBreak: true,
				});
		}
		pdfDoc.fontSize(26).text(`Total: $${totalPrice.toFixed(2)}`);

		pdfDoc.end(); // When finishing with creating the pdf doc, call the end method to stop writing the stream
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
	getIndexPage,
	getProductList,
	getProductDetailsPage,
	getCartPage,
	getOrdersPage,
	getOrderInvoice,
	getCheckoutPage,
	postCart,
	postCartDeleteProduct,
	postOrder,
};
