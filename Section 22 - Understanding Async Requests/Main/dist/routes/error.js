"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const errorController_1 = require("../controllers/errorController");
const router = express_1.default.Router();
router.get('/500', errorController_1.get500ErrorPage);
exports.default = router;
//# sourceMappingURL=error.js.map