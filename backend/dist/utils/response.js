"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.response = response;
function response(success, message, data = null) {
    if (success) {
        return {
            success: success,
            message: message,
            body: data
        };
    }
    return {
        success: success,
        message: message,
        error: data
    };
}
//# sourceMappingURL=response.js.map