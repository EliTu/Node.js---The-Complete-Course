"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
/**
 * a simple util function to remove a file based on the file path.
 * @param filePath the path url to the file in the file system as saved on the DB.
 */
const removeFile = (filePath) => {
    const resolvedPath = filePath.substr(1, filePath.length - 1); // remove the initial '/' char
    fs_1.default.unlink(resolvedPath, (error) => {
        if (error)
            throw error;
    });
};
exports.default = removeFile;
//# sourceMappingURL=removeFile.js.map