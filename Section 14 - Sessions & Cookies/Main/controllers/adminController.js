const Product = require('../models/product');
const { setProductForm } = require('../util/forms');

// Specific for '/admin/...':
const getAddProduct = (req, res) => {
	const { isLoggedIn } = req.session.loginData;
	res.render('admin/set-product', {
		docTitle: 'Add Product',
		pageSubtitle: 'Add a product',
		forms: setProductForm,
		path: '/admin/add-product',
		isLoggedIn: isLoggedIn && isLoggedIn,
		formsActive: true,
		formsCSS: true,
	});
};

const getEditProduct = async (req, res) => {
	const { isLoggedIn } = req.session.loginData;
	const editMode = req.query.edit;
	if (!editMode) return res.redirect('/');

	const prodId = req.params.productId;

	try {
		const product = await Product.findById(prodId);
		if (!product) return res.redirect('/');

		res.render('admin/set-product', {
			docTitle: 'Edit Product',
			pageSubtitle: 'Edit Product',
			forms: setProductForm,
			path: '/admin/edit-product',
			formsActive: true,
			formsCSS: true,
			isEditingProduct: editMode,
			product: product,
			isLoggedIn: isLoggedIn && isLoggedIn,
		});
	} catch (error) {
		console.log(error);
	}
};

const getAdminProduct = async (req, res) => {
	const { isLoggedIn } = req.session.loginData;
	try {
		const products = await Product.find();
		// .select('title price -_id')
		// .populate('userId');
		res.render('admin/admin-products', {
			docTitle: 'Admin Products',
			pageSubtitle: 'Products in store',
			path: '/admin/admin-products',
			products: products,
			isLoggedIn: isLoggedIn && isLoggedIn,
		});
	} catch (error) {
		console.log(error);
	}
};

const postProduct = async (req, res) => {
	const { userData } = req.session.loginData;
	const productId = req.body.productId && req.body.productId;
	const { title, description, price, imageUrl } = req.body;
	const product = new Product({
		title: title,
		price: price,
		description: description,
		imageUrl: !imageUrl
			? `https://loremflickr.com/320/240/taiwan?random=${
					Math.floor(Math.random() * (45 - 1)) + 1
			  }`
			: imageUrl,
		userId: userData._id,
	});

	if (!productId) {
		// Save a new product
		try {
			await product.save();

			res.redirect('/products');
		} catch (error) {
			console.log(error);
		}
	} else {
		// Update an existing product
		try {
			const productToUpdate = await Product.findById(productId);
			if (!productToUpdate) res.redirect('/admin/admin-product');

			await Product.findByIdAndUpdate(productToUpdate._id, {
				title: title,
				price: price,
				description: description,
				imageUrl: imageUrl,
			});
			res.redirect('/admin/admin-products');
		} catch (error) {
			console.log(error);
		}
	}
};

const postDeleteProduct = async (req, res) => {
	const productId = req.body.deletedProductId;
	try {
		await Product.findByIdAndRemove(productId);
		res.redirect('/admin/admin-products');
	} catch (error) {
		console.log(error);
	}
};

module.exports = {
	getAddProduct,
	getEditProduct,
	getAdminProduct,
	postProduct,
	postDeleteProduct,
};
