"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const isAuthenticated_1 = __importDefault(require("../middleware/isAuthenticated"));
const validations_1 = require("../util/validations");
const router = express_1.default.Router();
// Controller import
const adminController_1 = require("../controllers/adminController");
/* the middleware parse the arguments from left to right, so we can add as many middlewares, like isAuthenticated, before the final resolving function as we like*/
// /admin/add-product => GET
router.get('/add-product', isAuthenticated_1.default, adminController_1.getAddProduct);
router.get('/admin-products', isAuthenticated_1.default, adminController_1.getAdminProduct);
router.get('/edit-product/:productId', isAuthenticated_1.default, adminController_1.getEditProduct);
// /admin/add-product => POST
router.post('/add-product', isAuthenticated_1.default, validations_1.postProductValidation, adminController_1.postProduct);
router.post('/edit-product', isAuthenticated_1.default, validations_1.postProductValidation, adminController_1.postProduct);
// Using async request (and not form action)
router.delete('/product/:productId', isAuthenticated_1.default, adminController_1.deleteProduct);
exports.default = router;
//# sourceMappingURL=admin.js.map