const Product = require('../models/product');
const forms = [
	{
		name: 'title',
		type: 'text',
		title: 'Title',
		placeholder: "Enter the product's title",
	},
	{
		name: 'imageUrl',
		type: 'url',
		title: 'Image URL',
		placeholder: 'Enter product image URL',
	},
	{
		name: 'price',
		type: 'number',
		title: 'Price',
		placeholder: "Enter product's price",
	},
	{
		name: 'description',
		type: 'textarea',
		title: 'Description',
		placeholder: 'Enter a brief description of the product',
	},
];

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

const getEditProduct = (req, res) => {
	const editMode = req.query.edit;
	if (!editMode) return res.redirect('/');

	const prodId = req.params.productId;
	const getProductCallback = (product) => {
		if (!product) return res.redirect('/');

		res.render('admin/set-product', {
			docTitle: 'Edit Product',
			pageSubtitle: 'Edit Product',
			forms: forms,
			path: '/admin/edit-product',
			formsActive: true,
			formsCSS: true,
			isEditingProduct: editMode,
			product: product,
		});
	};

	Product.findProductById(prodId, getProductCallback);
};

const getAdminProduct = (_, res) => {
	const fetchCallback = (products) => {
		res.render('admin/admin-products', {
			docTitle: 'Admin Products',
			pageSubtitle: 'Products in store',
			path: '/admin/admin-products',
			products: products,
		});
	};
	Product.fetchAll(fetchCallback);
};

const postProduct = async (req, res) => {
	const productId = req.body.productId && req.body.productId;
	const { title, description, price, imageUrl } = req.body;

	if (!productId) {
		// Save a new product
		try {
			await Product.create({
				title: title,
				price: price,
				imageUrl: !imageUrl
					? `https://loremflickr.com/320/240/taiwan?random=${
							Math.floor(Math.random() * (45 - 1)) + 1
					  }`
					: imageUrl,
				description: description,
			});

			res.redirect('/products');
		} catch (error) {
			console.log(error);
		}
	} else {
		//  Update an existing product
		const updatedProduct = new Product(
			title,
			imageUrl,
			price,
			description,
			productId
		);
		updatedProduct.saveProduct();

		res.redirect('/admin/admin-products');
	}
};

const postDeleteProduct = (req, res) => {
	const productId = req.body.deletedProductId;
	Product.deleteProduct(productId);

	res.redirect('/admin/admin-products');
};

module.exports = {
	getAddProduct,
	getEditProduct,
	getAdminProduct,
	postProduct,
	postDeleteProduct,
};
