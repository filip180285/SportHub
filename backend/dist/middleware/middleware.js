"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTokenMiddleware = void 0;
const jwt = require('jsonwebtoken');
const verifyTokenMiddleware = (allowedUserTypes) => {
    return (req, res, next) => {
        var _a;
        const token = ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]) || '';
        if (!token) {
            return res.status(400).json({ "message": "Nema tokena u zaglavlju!" });
        }
        try {
            // verifikacija tokena
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
            const role = decodedToken.role;
            // provera da li je odgovarajuca uloga
            if (!allowedUserTypes.includes(role)) {
                return res.status(401).json({ "message": "Nemate pristup ovoj usluzi!" });
            }
            // ako je sve u redu, obraditi zahtev
            next();
        }
        catch (error) {
            return res.status(403).json({ "message": "Vaša sesija je istekla!" });
        }
    };
};
exports.verifyTokenMiddleware = verifyTokenMiddleware;
//# sourceMappingURL=middleware.js.map