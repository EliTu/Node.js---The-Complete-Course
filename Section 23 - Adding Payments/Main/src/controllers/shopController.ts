import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import Stripe from 'stripe';

import Product, { ProductModel } from '../models/product';
import Order, { OrderModel, Products } from '../models/order';

import setUserMessage from '../util/setUserMessage';
import setErrorMiddlewareObject from '../util/setErrorMiddlewareObject';
import { getPaginationData, ITEMS_PER_PAGE } from '../util/getPaginationData';
import { isProduct } from '../util/typeguards';

// Types
type DeleteProductBodyType = {
	isDeleteAll: boolean;
	cartDeleteId: ProductModel['_id'];
	cardDeleteProductName: string;
};

// Utils
const getUserCartData = async (req: Request) => {
	const userCart = await req.user
		.populate('cart.items.productId')
		.execPopulate();
	const cartProducts = [...userCart.cart.items];

	const priceCalc = +cartProducts
		.reduce((a, c) => {
			if (isProduct(c.productId)) {
				return a + +c.productId.price * +c.quantity;
			}
		}, 0)
		.toFixed(2);

	return { cartProducts, priceCalc };
};

//  Specific for shop or '/':
export const getIndexPage = (req: Request, res: Response) => {
	res.render('shop/index', {
		docTitle: 'Shop Main Page',
		pageSubtitle: 'Welcome to the shop',
		path: '/',
		success: setUserMessage(req.flash('success')),
		error: setUserMessage(req.flash('error')),
	});
};

export const getProductList = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const page = +req.query.page || 1;
	try {
		const totalNumberOfProducts = await Product.countDocuments(); // count the amount documents in the products collection

		const products = await Product.find()
			.skip((page - 1) * ITEMS_PER_PAGE) // skip finding results based on current page and the limit of items
			.limit(ITEMS_PER_PAGE); // also limit the amount of data retrieved by the items per page value

		const {
			hasNextPage,
			hasPreviousPage,
			lastPage,
			nextPage,
			previousPage,
		} = getPaginationData(page, totalNumberOfProducts);

		res.render('shop/product-list', {
			docTitle: 'Product List',
			pageSubtitle: 'Available Products',
			products,
			path: '/products',
			hasProducts: products.length,
			productsActive: true,
			productCSS: true,
			currentPage: page,
			hasNextPage,
			hasPreviousPage,
			nextPage,
			previousPage,
			lastPage,
			success: setUserMessage(req.flash('success')),
		});
	} catch (error) {
		setErrorMiddlewareObject(error, next);
	}
};

export const getProductDetailsPage = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
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

export const getCartPage = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { cartProducts, priceCalc } = await getUserCartData(req);

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

export const getCheckoutPage = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// instantiate stripe with the secret key
	const stripe = new Stripe(
		'sk_test_51IFXgfI7bWgkmmL4deebQsynH8A6B6gL7w7lhL5jm8eND7dhoYms6MMvEVhGoOmyhvwoixOGL4B57R4UctSTBKS500stv05ksb', // TODO: make this key and other keys a secret
		{ apiVersion: '2020-08-27' }
	);

	try {
		const { cartProducts, priceCalc } = await getUserCartData(req);

		// Create a stripe session
		const stripeSession = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			line_items: cartProducts.map((product) => {
				if (isProduct(product.productId)) {
					return {
						name: product.productId.title,
						description: product.productId.description,
						amount: Math.round(product.productId.price * 100),
						currency: 'usd',
						quantity: product.quantity,
					};
				}
			}),
			success_url: `${req.protocol}://${req.get('host')}/checkout/success`, // example: http://localhost:3000/checkout/sucesss
			cancel_url: `${req.protocol}://${req.get('host')}/checkout/cancel`,
		});

		res.render('shop/checkout', {
			docTitle: 'Checkout',
			pageSubtitle: 'Checkout',
			path: '/checkout',
			cartProducts: cartProducts,
			totalPrice: priceCalc,
			stripeSessionId: stripeSession.id,
			success: setUserMessage(req.flash('success')),
		});
	} catch (error) {
		setErrorMiddlewareObject(error, next);
	}
};

export const getOrdersPage = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
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

export const getOrderInvoice = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { orderId } = req.params as OrderModel['id'];
	try {
		const order = await Order.findById(orderId);

		if (!order) return setErrorMiddlewareObject('No order found', next);
		if (order.user.userId.toString() !== req.user._id.toString())
			return setErrorMiddlewareObject('Unauthorized access attempt', next);

		const invoiceFileName = `invoice-${orderId}.pdf`;
		const invoicePath = path.join(
			__dirname,
			'../',
			'assets',
			'invoices',
			invoiceFileName
		); // construct a path to the relevant invoice

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
		for (const { product, quantity } of order.products) {
			const { title, price, description } = product;
			totalPrice += quantity * price;

			pdfDoc
				.fontSize(16)
				.text(`Product name: ${title}`, { lineGap: 5, indent: 20 })
				.text(`Quantity: ${quantity}`, { lineGap: 5, indent: 20 })
				.text(
					`Item price: $${price} ${
						quantity > 1
							? `(Total for ${quantity} items: $${(price * quantity).toFixed(
									2
							  )})`
							: ''
					}`,
					{ lineGap: 5, indent: 20 }
				)
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

export const postCart = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { cartAddId: prodId } = req.body as ProductModel['_id'];

	try {
		const product = await Product.findById(prodId);
		await req.user.addToCart(product);

		req.flash('success', `${product.title} has been added to the cart`);
		res.redirect('/cart');
	} catch (error) {
		setErrorMiddlewareObject(error, next);
	}
};

export const postCartDeleteProduct = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const {
		isDeleteAll,
		cartDeleteId,
		cardDeleteProductName: productTitle,
	} = req.body as DeleteProductBodyType;

	try {
		await req.user.removeFromCart(cartDeleteId, isDeleteAll);

		const removeMessage = isDeleteAll
			? `${productTitle} has been removed from the cart`
			: `One (1) ${productTitle} item has been removed from the cart`;
		req.flash('success', removeMessage);
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

export const getCheckoutSuccess = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const cartProductsData = await req.user
			.populate('cart.items.productId')
			.execPopulate();

		const products: Products = [...cartProductsData.cart.items].map((item) => {
			return {
				quantity: item.quantity,
				product: { ...(item.productId as any)._doc }, // TODO: FIND A WAY TO TYPE THIS TO GET _DOC TYPE
			};
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
