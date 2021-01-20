"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const isAuthenticated_1 = __importDefault(require("../middleware/isAuthenticated"));
const shopController_1 = require("../controllers/shopController");
const router = express_1.default.Router();
/* the middleware parse the arguments from left to right, so we can add as many middlewares, like isAuthenticated, before the final resolving function as we like*/
router.get('/', shopController_1.getIndexPage);
router.get('/products', shopController_1.getProductList);
router.get('/products/:productId', shopController_1.getProductDetailsPage);
router.get('/cart', isAuthenticated_1.default, shopController_1.getCartPage);
router.get('/orders', isAuthenticated_1.default, shopController_1.getOrdersPage);
router.get('/orders/:orderId', isAuthenticated_1.default, shopController_1.getOrderInvoice);
router.get('/checkout', isAuthenticated_1.default, shopController_1.getCheckoutPage);
router.post('/cart', isAuthenticated_1.default, shopController_1.postCart);
router.post('/cart-delete-product', isAuthenticated_1.default, shopController_1.postCartDeleteProduct);
router.post('/create-order', isAuthenticated_1.default, shopController_1.postOrder);
exports.default = router;
//# sourceMappingURL=shop.js.map