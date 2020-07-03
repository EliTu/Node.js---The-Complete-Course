const Product = require('../models/product.js');
const Cart = require('../models/cart.js');

//  Specific for shop or '/':
const getShopPage = (_, res) => {
	res.render('shop/index', {
		docTitle: 'Shop Main Page',
		pageSubtitle: 'Welcome to the shop',
		path: '/',
	});
};

const getOrdersPage = (_, res) => {
	res.render('shop/orders', {
		docTitle: 'Orders',
		pageSubtitle: 'Your Orders',
		path: '/orders',
	});
};

const getCartPage = async (req, res) => {
	try {
		const userCart = await req.user.getCart();
		const cartProducts = await userCart.getProducts();

		res.render('shop/cart', {
			docTitle: 'Cart',
			pageSubtitle: 'Your Cart',
			path: '/cart',
			cartProducts: cartProducts,
			// totalPrice: ,
		});
	} catch (error) {
		console.log(error);
	}
};

const postCart = async (req, res) => {
	const prodId = req.body.productId;

	try {
		const cart = await req.user.getCart();
		const [cartProduct] = await cart.getProducts({ where: { id: prodId } });

		let newQuantity = 1;

		// If cart should be updated with an existing product (increment++)
		if (cartProduct) {
			const existingProduct = cartProduct;

			if (existingProduct) {
				const oldQuantity = existingProduct.cartItem.quantity;
				newQuantity = oldQuantity + 1;

				try {
					await cart.addProduct(existingProduct, {
						through: { quantity: newQuantity },
					});
					res.redirect('/cart');
				} catch (error) {
					console.log(error);
				}
				return;
			}

			// If no previous cart item, create a new one with quantity of 1
			const newCartProduct = await Product.findByPk(prodId);
			await cart.addProduct(newCartProduct, {
				through: { quantity: newQuantity },
			});
		}
		res.redirect('/cart');
	} catch (error) {
		console.log(error);
	}
};

const postCartDeleteProduct = async (req, res) => {
	const {
		cartDeleteId: id,
		cartDeletePrice: price,
		isDeleteAll: isDeleteAll,
	} = req.body;

	try {
		const cart = await req.user.getCart();
		const [product] = await cart.getProducts({ where: { id: id } });

		await product.cartItem.destroy();
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
		const products = await Product.findAll();
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
		// const product = await Product.findAll({where: {id: productId}})
		const product = await Product.findByPk(productId);
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

module.exports = {
	getAllProducts,
	getProductDetailsPage,
	getShopPage,
	getCartPage,
	getOrdersPage,
	getCheckoutPage,
	postCart,
	postCartDeleteProduct,
};
