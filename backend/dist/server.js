"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = __importDefault(require("./routes"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: (_a = process.env.ORIGIN_URL) !== null && _a !== void 0 ? _a : "http://localhost:5173",
    credentials: true
}));
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/storage", express_1.default.static(path_1.default.join(__dirname, '../storage')));
app.use('/api', routes_1.default);
exports.default = app;
//# sourceMappingURL=server.js.map