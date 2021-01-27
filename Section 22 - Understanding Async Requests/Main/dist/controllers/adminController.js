"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.postProduct = exports.getEditProduct = exports.getAddProduct = exports.getAdminProduct = void 0;
const product_1 = __importDefault(require("../models/product"));
const forms_1 = __importDefault(require("../util/forms"));
const validations_1 = require("../util/validations");
const setUserMessage_1 = __importDefault(require("../util/setUserMessage"));
const setErrorMiddlewareObject_1 = __importDefault(require("../util/setErrorMiddlewareObject"));
const removeFile_1 = __importDefault(require("../util/removeFile"));
const getPaginationData_1 = require("../util/getPaginationData");
const path_1 = __importDefault(require("path"));
const { setProductForm } = forms_1.default;
/* GET CONTROLS */
const getAdminProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const page = +req.query.page || 1;
    try {
        const products = yield product_1.default.find({ userId: req.user._id })
            .skip((page - 1) * getPaginationData_1.ITEMS_PER_PAGE) // skip finding results based on current page and the limit of items
            .limit(getPaginationData_1.ITEMS_PER_PAGE); // also limit the amount of data retrieved by the items per page value
        // .select('title price -_id')
        // .populate('userId');
        const totalNumberOfProducts = yield product_1.default.countDocuments(); // count the amount documents in the products collection
        const { hasNextPage, hasPreviousPage, lastPage, nextPage, previousPage, } = getPaginationData_1.getPaginationData(page, totalNumberOfProducts);
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
            success: setUserMessage_1.default(req.flash('success')),
        });
    }
    catch (error) {
        setErrorMiddlewareObject_1.default(error, next);
    }
});
exports.getAdminProduct = getAdminProduct;
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
exports.getAddProduct = getAddProduct;
const getEditProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const editMode = req.query.edit;
    if (!editMode)
        return res.redirect('/');
    const prodId = req.params.productId;
    try {
        const product = yield product_1.default.findById(prodId);
        if (!product)
            return res.redirect('/');
        // extract the imageUrl without the full path
        const { imageUrl } = product;
        const [, , , imageName] = imageUrl.split('/');
        const updatedProductData = Object.assign(Object.assign({}, product._doc), { imageUrl: imageName });
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
    }
    catch (error) {
        setErrorMiddlewareObject_1.default(error, next);
    }
});
exports.getEditProduct = getEditProduct;
/* POST CONTROLS */
const postProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, price, _id } = req.body;
    const { path } = req.route;
    const image = req.file; // get the image by accessing the file parsed by multer middleware
    let imagePartialPath;
    if (image) {
        imagePartialPath = image.path.split('src')[1];
    }
    const isFormInvalid = validations_1.checkForValidationErrors(req, res, 'admin/set-product', {
        docTitle: path.includes('edit') ? 'Edit Product' : 'Add Product',
        pageSubtitle: path.includes('edit') ? 'Edit a Product' : 'Add a product',
        forms: setProductForm,
        path: `/admin${path}`,
        formsActive: true,
        formsCSS: true,
        productData: {
            title,
            description,
            price,
            _id,
        },
        isEditingProduct: path.includes('edit'),
    });
    if (isFormInvalid)
        return null;
    const newImageUrl = imagePartialPath ? imagePartialPath : null; // if new image has been uploaded, set it as the the imageUrl to be added
    // if the image file is valid, we will pass the file path reference to the DB and not the whole file
    if (!_id) {
        // save a new product
        const product = new product_1.default({
            title,
            price,
            description,
            imageUrl: newImageUrl,
            userId: req.user._id,
        });
        try {
            yield product.save();
            req.flash('success', `${title} has been successfully added`);
            return res.redirect('/products');
        }
        catch (error) {
            setErrorMiddlewareObject_1.default(error, next);
        }
    }
    else {
        // Update an existing product
        try {
            const productToUpdate = yield product_1.default.findById(_id);
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
            if (imageUrl && newImageUrl)
                removeFile_1.default(imageUrl);
            yield product_1.default.findByIdAndUpdate(productToUpdate._id, {
                title,
                price,
                description,
                imageUrl: newImageUrl ? newImageUrl : imageUrl,
            });
            req.flash('success', `${title} has been successfully edited`);
            return res.redirect('/admin/admin-products');
        }
        catch (error) {
            setErrorMiddlewareObject_1.default(error, next);
        }
    }
});
exports.postProduct = postProduct;
const deleteProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.productId;
    try {
        const { imageUrl, title } = yield product_1.default.findById(productId);
        const { deletedCount } = yield product_1.default.deleteOne({
            _id: productId,
            userId: req.user._id,
        });
        if (deletedCount === 0) {
            req.flash('error', 'Could not delete product');
            // Instead of redirecting and rendering a new page, return json data
            return res.status(500).json({
                message: 'Could not delete product',
            });
        }
        if (imageUrl) {
            const imageFullPath = `${path_1.default.join(__dirname, '../')}${imageUrl}`;
            removeFile_1.default(imageFullPath);
        }
        req.flash('success', `${title} has been successfully deleted`);
        // instead of redirecting, send back JSON data
        return res
            .status(200)
            .json({ message: `${title} has been successfully deleted` });
    }
    catch (error) {
        // Instead of passing the error to the error handler middleware, return json data
        res.status(500).json({
            message: `Delete attempt failed, ${error}`,
        });
    }
});
exports.deleteProduct = deleteProduct;
//# sourceMappingURL=adminController.js.map