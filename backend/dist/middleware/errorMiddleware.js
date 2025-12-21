"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.errorHandler = void 0;
const errorHandler = (err, _req, res, _next) => {
    console.error("Error:", err);
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode).json({
        error: err.message || "Internal server error",
        stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    });
};
exports.errorHandler = errorHandler;
const notFoundHandler = (_req, res) => {
    res.status(404).json({
        error: "Route not found",
    });
};
exports.notFoundHandler = notFoundHandler;
//# sourceMappingURL=errorMiddleware.js.map