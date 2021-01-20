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
exports.postOrder = exports.getCheckoutPage = exports.postCartDeleteProduct = exports.postCart = exports.getOrderInvoice = exports.getOrdersPage = exports.getCartPage = exports.getProductDetailsPage = exports.getProductList = exports.getIndexPage = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const product_1 = __importDefault(require("../models/product"));
const order_1 = __importDefault(require("../models/order"));
const setUserMessage_1 = __importDefault(require("../util/setUserMessage"));
const setErrorMiddlewareObject_1 = __importDefault(require("../util/setErrorMiddlewareObject"));
const getPaginationData_1 = require("../util/getPaginationData");
//  Specific for shop or '/':
const getIndexPage = (req, res) => {
    res.render('shop/index', {
        docTitle: 'Shop Main Page',
        pageSubtitle: 'Welcome to the shop',
        path: '/',
        success: setUserMessage_1.default(req.flash('success')),
        error: setUserMessage_1.default(req.flash('error')),
    });
};
exports.getIndexPage = getIndexPage;
const getProductList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const page = +req.query.page || 1;
    try {
        const totalNumberOfProducts = yield product_1.default.countDocuments(); // count the amount documents in the products collection
        const products = yield product_1.default.find()
            .skip((page - 1) * getPaginationData_1.ITEMS_PER_PAGE) // skip finding results based on current page and the limit of items
            .limit(getPaginationData_1.ITEMS_PER_PAGE); // also limit the amount of data retrieved by the items per page value
        const { hasNextPage, hasPreviousPage, lastPage, nextPage, previousPage, } = getPaginationData_1.getPaginationData(page, totalNumberOfProducts);
        res.render('shop/product-list', {
            docTitle: 'Product List',
            pageSubtitle: 'Available Products',
            products,
            path: '/products',
            hasProducts: products.length,
            productsActive: true,
            productCSS: true,
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
exports.getProductList = getProductList;
const getProductDetailsPage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.productId;
    try {
        const product = yield product_1.default.findById(productId);
        res.render('shop/product-details', {
            docTitle: `Product: ${product.title}`,
            pageSubtitle: 'Product Details',
            product: product,
            path: '/products',
        });
    }
    catch (error) {
        setErrorMiddlewareObject_1.default(error, next);
    }
});
exports.getProductDetailsPage = getProductDetailsPage;
const getCartPage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userCart = yield req.user
            .populate('cart.items.productId')
            .execPopulate();
        const cartProducts = [...userCart.cart.items];
        const priceCalc = +cartProducts
            .reduce((a, c) => a + +c.productId.price * +c.quantity, 0)
            .toFixed(2);
        res.render('shop/cart', {
            docTitle: 'Cart',
            pageSubtitle: 'Your Cart',
            path: '/cart',
            cartProducts: cartProducts,
            totalPrice: priceCalc,
            success: setUserMessage_1.default(req.flash('success')),
        });
    }
    catch (error) {
        setErrorMiddlewareObject_1.default(error, next);
    }
});
exports.getCartPage = getCartPage;
const getOrdersPage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield order_1.default.find({ 'user.userId': req.session.user._id });
        res.render('shop/orders', {
            docTitle: 'Orders',
            pageSubtitle: 'Your Orders',
            path: '/orders',
            orders: orders,
            success: setUserMessage_1.default(req.flash('success')),
        });
    }
    catch (error) {
        setErrorMiddlewareObject_1.default(error, next);
    }
});
exports.getOrdersPage = getOrdersPage;
const getOrderInvoice = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    try {
        const order = yield order_1.default.findById(orderId);
        if (!order)
            return setErrorMiddlewareObject_1.default('No order found', next);
        if (order.user.userId.toString() !== req.user._id.toString())
            return setErrorMiddlewareObject_1.default('Unauthorized access attempt', next);
        const invoiceFileName = `invoice-${orderId}.pdf`;
        const invoicePath = path_1.default.join('assets', 'invoices', invoiceFileName); // construct a path to the relevant invoice
        const pdfDoc = new pdfkit_1.default(); // create a new pdfkit instance which is a stream
        res.setHeader('Content-Type', 'application/pdf'); // set the response header to allow the browser handle and display the pdf file
        res.setHeader('Content-Disposition', `inline; filename="${invoiceFileName}"`); // set the response header to make sure the pdf is displayed in the browser and has a file name
        pdfDoc.pipe(fs_1.default.createWriteStream(invoicePath)); // pipe it to a writable stream we can create with fs
        pdfDoc.pipe(res); // also pipe it to the res
        // populate the pdf with the relevant data
        pdfDoc
            .fontSize(20)
            .text(`Invoice for order ${orderId}`, {
            align: 'left',
        })
            .fontSize(16)
            .text(`To: ${req.user.email}`, {
            lineBreak: true,
            lineGap: 10,
        })
            .fontSize(16)
            .text('---------------------------------------------------------------------------', { lineGap: 20, lineBreak: true })
            .fontSize(20)
            .text('Product details:', { lineGap: 10 });
        let totalPrice = 0; //TODO: SEE IF ITS POSSIBLE TO CREATE A REUSABLE TOTAL PRICE CALC FUNCTION
        // Loop through all of the possible order products and create pdf texts for each and set the total price
        for (const orderProdObj of order.products) {
            const { product, quantity } = orderProdObj;
            const { title, price, description } = product;
            totalPrice += quantity * price;
            pdfDoc
                .fontSize(16)
                .text(`Product name: ${title}`, { lineGap: 5, indent: 20 })
                .text(`Quantity: ${quantity}`, { lineGap: 5, indent: 20 })
                .text(`Product description: ${description}`, {
                lineGap: 30,
                indent: 20,
                lineBreak: true,
            });
        }
        pdfDoc.fontSize(26).text(`Total: $${totalPrice.toFixed(2)}`);
        pdfDoc.end(); // When finishing with creating the pdf doc, call the end method to stop writing the stream
    }
    catch (error) {
        setErrorMiddlewareObject_1.default(error, next);
    }
});
exports.getOrderInvoice = getOrderInvoice;
const postCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { cartAddId: prodId } = req.body;
    try {
        const product = yield product_1.default.findById(prodId);
        yield req.user.addToCart(product);
        req.flash('success', `${product.title} has been added to the cart`);
        res.redirect('/cart');
    }
    catch (error) {
        setErrorMiddlewareObject_1.default(error, next);
    }
});
exports.postCart = postCart;
const postCartDeleteProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { isDeleteAll, cartDeleteId, cardDeleteProductName: productTitle, } = req.body;
    try {
        yield req.user.removeFromCart(cartDeleteId, isDeleteAll);
        req.flash('success', `${productTitle} has been removed from the cart`);
    }
    catch (error) {
        // req.flash(
        // 	'error',
        // 	`Something went wrong! ${productTitle} wasn't removed successfully`
        // ); // TODO: figure out how to handle unsuccessful removal inside the try block
        setErrorMiddlewareObject_1.default(error, next);
    }
    finally {
        res.redirect('/cart');
    }
});
exports.postCartDeleteProduct = postCartDeleteProduct;
const getCheckoutPage = (req, res) => {
    res.render('shop/checkout', {
        docTitle: 'Checkout',
        pageSubtitle: 'Checkout',
        path: '/checkout',
    });
};
exports.getCheckoutPage = getCheckoutPage;
const postOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cartProductsData = yield req.user
            .populate('cart.items.productId')
            .execPopulate();
        const products = [...cartProductsData.cart.items].map((item) => {
            return {
                quantity: item.quantity,
                product: Object.assign({}, item.productId._doc),
            };
        });
        const order = new order_1.default({
            products: products,
            user: {
                email: req.user.email,
                userId: req.user,
            },
        });
        yield order.save();
        yield req.user.clearCart();
        req.flash('success', `Order ${order._id} has been made successfully`);
        res.redirect('/orders');
    }
    catch (error) {
        setErrorMiddlewareObject_1.default(error, next);
    }
});
exports.postOrder = postOrder;
//# sourceMappingURL=shopController.js.map