"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isProduct = void 0;
/**
 * Type guard to check and confirm that a specific object is compatible with the ProductModel.
 * Good use case is after calling mongoose's .populate() or .execPopulate() to type the result correctly.
 * @param obj the object we're checking.
 */
const isProduct = (obj) => {
    return obj && obj.title && typeof obj.title === 'string';
};
exports.isProduct = isProduct;
//# sourceMappingURL=typeguards.js.map