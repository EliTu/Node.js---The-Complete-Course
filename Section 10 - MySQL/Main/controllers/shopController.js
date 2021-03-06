const Product = require('../models/product');
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

const getCartPage = (_, res) => {
	const fetchCart = (cart) => {
		Product.fetchAll()
			.then(([rows]) => {
				let cartProducts = [];
				for (product of rows) {
					const cartProductData = cart.products.find(
						(prod) => prod.id === product.id
					);
					if (cartProductData) {
						cartProducts.push({
							productData: product,
							quantity: cartProductData.quantity,
						});
					}
				}

				res.render('shop/cart', {
					docTitle: 'Cart',
					pageSubtitle: 'Your Cart',
					path: '/cart',
					cartProducts: cartProducts,
					totalPrice: cart.totalPrice,
				});
			})
			.catch((e) => console.log(e));
	};
	Cart.getAllCartProducts(fetchCart);
};

const postCart = (req, res) => {
	const prodId = req.body.productId;
	const addProductCallback = (product) =>
		Cart.addProduct(prodId, product.price);

	Product.findProductById(prodId, addProductCallback);

	res.redirect('/cart');
};

const postCartDeleteProduct = (req, res) => {
	const {
		cartDeleteId: id,
		cartDeletePrice: price,
		isDeleteAll: isDeleteAll,
	} = req.body;

	Cart.deleteProduct(id, price, isDeleteAll);

	res.redirect('/cart');
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
		const [products] = await Product.fetchAll();
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
		const [product] = await Product.findProductById(productId);
		res.render('shop/product-details', {
			docTitle: `Product: ${product[0].title}`,
			pageSubtitle: 'Product Details',
			product: product[0],
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
