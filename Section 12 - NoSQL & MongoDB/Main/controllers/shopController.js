const Product = require('../models/product.js');

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
	// 	try {
	// 		const cart = await req.user.getCart();
	// 		const [cartProduct] = await cart.getProducts({ where: { id: prodId } });

	// 		let newQuantity = 1;

	// 		// If cart should be updated with an existing product (increment++)
	// 		if (cartProduct) {
	// 			const existingProduct = cartProduct;

	// 			if (existingProduct) {
	// 				const oldQuantity = existingProduct.cartItem.quantity;
	// 				newQuantity = oldQuantity + 1;

	// 				try {
	// 					await cart.addProduct(existingProduct, {
	// 						through: { quantity: newQuantity },
	// 					});
	// 					res.redirect('/cart');
	// 				} catch (error) {
	// 					console.log(error);
	// 				}
	// 				return;
	// 			}
	// 		}
	// 		// If no previous cart item, create a new one with quantity of 1
	// 		const newCartProduct = await Product.findByPk(prodId);
	// 		await cart.addProduct(newCartProduct, {
	// 			through: { quantity: newQuantity },
	// 		});

	// 		res.redirect('/cart');
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
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
		const userCart = await req.user.getCart();
		const products = await userCart.getProducts();

		const order = await req.user.createOrder();

		await order.addProduct(
			products.map((product) => {
				product.orderItem = { quantity: product.cartItem.quantity };
				return product;
			})
		);

		// Once the order has been made we should empty the cart
		await userCart.setProducts(null);

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
