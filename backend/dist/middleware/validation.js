"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequestBody = validateRequestBody;
exports.validateRequestParams = validateRequestParams;
exports.validateQueryParams = validateQueryParams;
const zod_1 = require("zod");
const http_status_codes_1 = require("http-status-codes");
const response_1 = require("../utils/response");
function validateRequestBody(schema) {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            console.error('Body error', error);
            if (error instanceof zod_1.ZodError) {
                const errorMessages = error.errors.map((issue) => ({
                    message: `${issue.path.join('.')} is ${issue.message}`,
                }));
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json((0, response_1.response)(false, 'Invalid body data', errorMessages));
            }
            else {
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json((0, response_1.response)(false, 'Internal server error', error));
            }
        }
    };
}
function validateRequestParams(schema) {
    return (req, res, next) => {
        try {
            schema.parse(req.params);
            next();
        }
        catch (error) {
            console.error('Params error', error);
            if (error instanceof zod_1.ZodError) {
                const errorMessages = error.errors.map((issue) => ({
                    message: `${issue.path.join('.')} is ${issue.message}`,
                }));
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json((0, response_1.response)(false, 'Invalid params', errorMessages));
            }
            else {
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json((0, response_1.response)(false, 'Internal server error', error));
            }
        }
    };
}
function validateQueryParams(schema) {
    return (req, res, next) => {
        try {
            schema.parse(req.query);
            next();
        }
        catch (error) {
            console.error('Query error', error);
            if (error instanceof zod_1.ZodError) {
                const errorMessages = error.errors.map((issue) => ({
                    message: `${issue.path.join('.')} is ${issue.message}`,
                }));
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json((0, response_1.response)(false, 'Invalid query data', errorMessages));
            }
            else {
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json((0, response_1.response)(false, 'Internal server error', error));
            }
        }
    };
}
//# sourceMappingURL=validation.js.map