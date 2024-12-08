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
exports.createImageFile = exports.deleteFile = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const deleteFile = (filename) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filePath = path_1.default.join(__dirname, '../../storage', filename);
        if (fs_1.default.existsSync(filePath)) {
            yield fs_1.default.promises.unlink(filePath);
            console.log(`File ${filename} successfully deleted.`);
        }
        else {
            console.log(`File ${filename} not found.`);
        }
    }
    catch (error) {
        console.error(`Error deleting file ${filename}:`, error);
        if (error instanceof Error) {
            throw new Error(`Could not delete file: ${error.message}`);
        }
        throw error;
    }
});
exports.deleteFile = deleteFile;
const createImageFile = (fileName, fileBuffer) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filePath = path_1.default.join(__dirname, '../../storage', fileName);
        yield fs_1.default.promises.writeFile(filePath, fileBuffer);
        console.log(`Image file ${fileName} successfully created.`);
    }
    catch (error) {
        console.error(`Error creating image file ${fileName}:`, error);
        if (error instanceof Error) {
            throw new Error(`Could not create image file: ${error.message}`);
        }
        throw error;
    }
});
exports.createImageFile = createImageFile;
//# sourceMappingURL=file.js.map