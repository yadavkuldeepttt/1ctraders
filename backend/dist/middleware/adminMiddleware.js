"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = void 0;
// In-memory admin users list (replace with database check)
const adminUsers = ["admin@irma.com"];
const adminMiddleware = (req, res, next) => {
    try {
        const userEmail = req.userEmail;
        if (!adminUsers.includes(userEmail)) {
            return res.status(403).json({ error: "Access denied. Admin privileges required." });
        }
        next();
    }
    catch (error) {
        return res.status(403).json({ error: "Access denied" });
    }
};
exports.adminMiddleware = adminMiddleware;
//# sourceMappingURL=adminMiddleware.js.map