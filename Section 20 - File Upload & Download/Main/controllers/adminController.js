const Product = require('../models/product');
const { setProductForm } = require('../util/forms');
const { checkForValidationErrors } = require('../util/validations');
const setUserMessage = require('../util/setUserMessage');
const setErrorMiddlewareObject = require('../util/setErrorMiddlewareObject');
/* GET CONTROLS */

const getAdminProduct = async (req, res, next) => {
	try {
		const products = await Product.find({ userId: req.user._id });
		// .select('title price -_id')
		// .populate('userId');
		res.render('admin/admin-products', {
			docTitle: 'Admin Products',
			pageSubtitle: 'Products in store',
			path: '/admin/admin-products',
			products: products,
			success: setUserMessage(req.flash('success')),
		});
	} catch (error) {
		setErrorMiddlewareObject(error, next);
	}
};

// Specific for '/admin/...':
const getAddProduct = (req, res) => {
	res.render('admin/set-product', {
		docTitle: 'Add Product',
		pageSubtitle: 'Add a product',
		forms: setProductForm,
		path: '/admin/add-product',
		formsActive: true,
		formsCSS: true,
	});
};

const getEditProduct = async (req, res, next) => {
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
			productData: product,
		});
	} catch (error) {
		setErrorMiddlewareObject(error, next);
	}
};

/* POST CONTROLS */

const postProduct = async (req, res, next) => {
	const { title, description, price, image, productId } = req.body;
	const { path } = req.route;

	const isFormInvalid = checkForValidationErrors(
		req,
		res,
		'admin/set-product',
		{
			docTitle: path.includes('edit') ? 'Edit Product' : 'Add Product',
			pageSubtitle: path.includes('edit') ? 'Edit Product' : 'Add a product',
			forms: setProductForm,
			path: `/admin${path}`,
			formsActive: true,
			formsCSS: true,
			productData: { title, description, price, image, _id: productId },
			isEditingProduct: path.includes('edit'),
		}
	);
	if (isFormInvalid) return;

	if (!productId) {
		// Save a new product
		const product = new Product({
			title: title,
			price: price,
			description: description,
			image: !image
				? `https://loremflickr.com/320/240/kaohsiung?random=${
						Math.floor(Math.random() * (45 - 1)) + 1
				  }`
				: image,
			userId: req.user._id,
		});

		try {
			await product.save();

			req.flash('success', `${title} has been successfully added`);
			return res.redirect('/products');
		} catch (error) {
			setErrorMiddlewareObject(error, next);
		}
	} else {
		// Update an existing product
		try {
			const productToUpdate = await Product.findById(productId);

			if (!productToUpdate) {
				req.flash('error', 'No product to update');
				return res.redirect('/admin/admin-product');
			}
			if (productToUpdate.userId.toString() !== req.user._id.toString()) {
				req.flash('error', 'Could not edit products of other users');
				return res.redirect('/'); // Authorization guard - only the user who created the product can edit it
			}

			await Product.findByIdAndUpdate(productToUpdate._id, {
				title: title,
				price: price,
				description: description,
				image: image,
			});

			req.flash('success', `${title} has been successfully edited`);
			return res.redirect('/admin/admin-products');
		} catch (error) {
			setErrorMiddlewareObject(error, next);
		}
	}
};

const postDeleteProduct = async (req, res, next) => {
	const { deletedProductId: productId, deletedProductTitle: title } = req.body;
	try {
		const { deletedCount } = await Product.deleteOne({
			_id: productId,
			userId: req.user._id,
		});

		if (deletedCount === 0) req.flash('error', 'Could not delete product');

		req.flash('success', `${title} has been successfully deleted`);
		return res.redirect('/admin/admin-products');
	} catch (error) {
		setErrorMiddlewareObject(error, next);
	}
};

module.exports = {
	getAddProduct,
	getEditProduct,
	getAdminProduct,
	postProduct,
	postDeleteProduct,
};
