const Product = require('../models/product');
const { setProductForm } = require('../util/forms');
const { checkForValidationErrors } = require('../util/validations');
const setUserMessage = require('../util/setUserMessage');
const setErrorMiddlewareObject = require('../util/setErrorMiddlewareObject');
const removeFile = require('../util/removeFile');
const {
	ITEMS_PER_PAGE,
	getPaginationData,
} = require('../util/getPaginationData');

/* GET CONTROLS */

const getAdminProduct = async (req, res, next) => {
	const page = +req.query.page || 1;
	try {
		const products = await Product.find({ userId: req.user._id })
			.skip((page - 1) * ITEMS_PER_PAGE) // skip finding results based on current page and the limit of items
			.limit(ITEMS_PER_PAGE); // also limit the amount of data retrieved by the items per page value
		// .select('title price -_id')
		// .populate('userId');

		const totalNumberOfProducts = await Product.countDocuments(); // count the amount documents in the products collection

		const {
			hasNextPage,
			hasPreviousPage,
			lastPage,
			nextPage,
			previousPage,
		} = getPaginationData(page, totalNumberOfProducts);

		res.render('admin/admin-products', {
			docTitle: 'Admin Products',
			pageSubtitle: 'Products in store',
			path: '/admin/admin-products',
			hasProducts: products.length,
			products,
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

		// extract the imageUrl without the full path
		const { imageUrl } = product;
		const [, , , imageName] = imageUrl.split('/');
		const updatedProductData = { ...product._doc, imageUrl: imageName };

		res.render('admin/set-product', {
			docTitle: 'Edit Product',
			pageSubtitle: 'Edit Product',
			forms: setProductForm,
			path: '/admin/edit-product',
			formsActive: true,
			formsCSS: true,
			isEditingProduct: editMode,
			productData: updatedProductData,
		});
	} catch (error) {
		setErrorMiddlewareObject(error, next);
	}
};

/* POST CONTROLS */

const postProduct = async (req, res, next) => {
	const { title, description, price, productId } = req.body;
	const image = req.file; // get the image by accessing the file parsed by multer middleware
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
			productData: {
				title,
				description,
				price,
				_id: productId,
			},
			isEditingProduct: path.includes('edit'),
		}
	);
	if (isFormInvalid) return;

	const newImageUrl = image ? `/${image.path}` : null; // if new image has been uploaded, set it as the the imageUrl to be added

	// if the image file is valid, we will pass the file path reference to the DB and not the whole file
	if (!productId) {
		// save a new product
		const product = new Product({
			title,
			price,
			description,
			imageUrl: newImageUrl,
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
			// Authorization guard - only the user who created the product can edit it
			if (productToUpdate.userId.toString() !== req.user._id.toString()) {
				req.flash('error', 'Could not edit products of other users');
				return res.redirect('/');
			}

			const { imageUrl } = productToUpdate;

			// if about to set up a new imageUrl, first remove the old one from fs
			if (imageUrl && newImageUrl) removeFile(imageUrl);

			await Product.findByIdAndUpdate(productToUpdate._id, {
				title,
				price,
				description,
				imageUrl: newImageUrl ? newImageUrl : imageUrl, // if the user sets a new image, use the new one, otherwise set the old one that was retrieved from the DB
			});

			req.flash('success', `${title} has been successfully edited`);
			return res.redirect('/admin/admin-products');
		} catch (error) {
			setErrorMiddlewareObject(error, next);
		}
	}
};

const postDeleteProduct = async (req, res, next) => {
	const {
		deletedProductId: productId,
		deletedProductTitle: title,
		deletedProductImageUrl: imageUrl,
	} = req.body;
	try {
		const { deletedCount } = await Product.deleteOne({
			_id: productId,
			userId: req.user._id,
		});

		if (deletedCount === 0) {
			req.flash('error', 'Could not delete product');
			return res.redirect('/admin/admin-products');
		}
		if (imageUrl) removeFile(imageUrl);

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
