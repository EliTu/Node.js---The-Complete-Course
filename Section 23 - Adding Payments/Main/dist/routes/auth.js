"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validations_1 = require("../util/validations");
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
router.get('/login', authController_1.getLoginPage);
router.get('/signup', authController_1.getSignupPage);
router.get('/reset-password', authController_1.getPasswordResetPage);
router.get('/new-password/:token', authController_1.getNewPasswordPage);
router.post('/login', validations_1.loginValidations, authController_1.postLogin);
router.post('/logout', authController_1.postLogout);
router.post('/signup', validations_1.signupValidations, authController_1.postSignup);
router.post('/reset-password', authController_1.postPasswordReset);
router.post('/new-password', authController_1.postNewPassword);
exports.default = router;
//# sourceMappingURL=auth.js.map