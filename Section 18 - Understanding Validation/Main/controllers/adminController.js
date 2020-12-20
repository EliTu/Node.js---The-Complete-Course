const { validationResult } = require('express-validator');
const Product = require('../models/product');
const { setProductForm } = require('../util/forms');
const { setValidationErrorMessage } = require('../util/validations');
const setUserMessage = require('../util/setUserMessage');
/* GET CONTROLS */

const getAdminProduct = async (req, res) => {
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
		console.log(error);
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

const getEditProduct = async (req, res) => {
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
		});
	} catch (error) {
		console.log(error);
	}
};

/* POST CONTROLS */

const postProduct = async (req, res) => {
	const validationErrors = validationResult(req);
	const productId = req.body.productId && req.body.productId;
	const { title, description, price, imageUrl } = req.body;

	if (!validationErrors.isEmpty()) {
		const { msg, param } = validationErrors.array()[0];
		const errorMessage = setValidationErrorMessage(param, msg);

		return res.status(422).render('admin/set-product', {
			docTitle: 'Add Product',
			pageSubtitle: 'Add a product',
			forms: setProductForm,
			path: '/admin/add-product',
			formsActive: true,
			formsCSS: true,
			error: errorMessage,
			errorsArray: validationErrors.array(),
			prevData: { title, description, price, imageUrl },
		});
	}

	if (!productId) {
		// Save a new product
		const product = new Product({
			title: title,
			price: price,
			description: description,
			imageUrl: !imageUrl
				? `https://loremflickr.com/320/240/kaohsiung?random=${
						Math.floor(Math.random() * (45 - 1)) + 1
				  }`
				: imageUrl,
			userId: req.user._id,
		});

		try {
			await product.save();

			req.flash('success', `${title} has been successfully added`);
			return res.redirect('/products');
		} catch (error) {
			console.log(error);
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
				imageUrl: imageUrl,
			});

			req.flash('success', `${title} has been successfully edited`);
			return res.redirect('/admin/admin-products');
		} catch (error) {
			console.log(error);
		}
	}
};

const postDeleteProduct = async (req, res) => {
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
