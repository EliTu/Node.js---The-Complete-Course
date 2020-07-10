const Product = require('../models/product');
const forms = require('../util/forms');

// Specific for '/admin/...':
const getAddProduct = (_, res) => {
	res.render('admin/set-product', {
		docTitle: 'Add Product',
		pageSubtitle: 'Add a product',
		forms: forms,
		path: '/admin/add-product',
		formsActive: true,
		formsCSS: true,
	});
};

// const getEditProduct = async (req, res) => {
// 	const editMode = req.query.edit;
// 	if (!editMode) return res.redirect('/');

// 	const prodId = req.params.productId;

// 	try {
// 		const [product] = await req.user.getProducts({ where: { id: prodId } });
// 		if (!product) return res.redirect('/');

// 		res.render('admin/set-product', {
// 			docTitle: 'Edit Product',
// 			pageSubtitle: 'Edit Product',
// 			forms: forms,
// 			path: '/admin/edit-product',
// 			formsActive: true,
// 			formsCSS: true,
// 			isEditingProduct: editMode,
// 			product: product,
// 		});
// 	} catch (error) {
// 		console.log(error);
// 	}
// };

// const getAdminProduct = async (req, res) => {
// 	try {
// 		const products = await req.user.getProducts();
// 		res.render('admin/admin-products', {
// 			docTitle: 'Admin Products',
// 			pageSubtitle: 'Products in store',
// 			path: '/admin/admin-products',
// 			products: products,
// 		});
// 	} catch (error) {
// 		console.log(error);
// 	}
// };

const postProduct = async (req, res) => {
	const productId = req.body.productId && req.body.productId;
	const { title, description, price, imageUrl } = req.body;

	if (!productId) {
		// Save a new product
		try {
			const product = new Product(title, price, description, imageUrl);
			await product.save();

			res.redirect('/products');
		} catch (error) {
			console.log(error);
		}
	} else {
		// Update an existing product
		try {
			// const productToUpdate = await Product.findByPk(productId);
			// if (!productToUpdate) res.redirect('/admin/admin-product');

			// productToUpdate.update({
			// 	title: title,
			// 	imageUrl: imageUrl,
			// 	price: price,
			// 	description: description,
			// });
			res.redirect('/admin/admin-products');
		} catch (error) {
			console.log(error);
		}
	}
};

// const postDeleteProduct = async (req, res) => {
// 	const productId = req.body.deletedProductId;
// 	try {
// 		await Product.destroy({
// 			where: {
// 				id: productId,
// 			},
// 		});
// 		res.redirect('/admin/admin-products');
// 	} catch (error) {
// 		console.log(error);
// 	}
// };

module.exports = {
	getAddProduct,
	// getEditProduct,
	// getAdminProduct,
	postProduct,
	// postDeleteProduct,
};
