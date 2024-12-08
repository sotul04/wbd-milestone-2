"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authJWT = void 0;
const jwtHelper_1 = require("../utils/jwtHelper");
const response_1 = require("../utils/response");
const authJWT = (req, res, next) => {
    var _a, _b;
    const token = (_a = req.cookies.jwt) !== null && _a !== void 0 ? _a : (_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(' ')[1];
    if (!token) {
        res.status(401).json((0, response_1.response)(false, 'Authentication required', 'Unauthorized access'));
        return;
    }
    try {
        const decoded = (0, jwtHelper_1.verifyToken)(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json((0, response_1.response)(false, 'Invalid or expired token', 'Token is invalid or expired'));
    }
};
exports.authJWT = authJWT;
//# sourceMappingURL=auth.js.map