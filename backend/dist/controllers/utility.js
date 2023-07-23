"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utility = exports.secretKey = void 0;
const jwt = require('jsonwebtoken');
exports.secretKey = 'JWT_SECRET_KEY';
class Utility {
    static verifyToken(token, allowedUserTypes) {
        if (!token) {
            return 400; // nema tokena u zaglavlju 
        }
        try {
            // verifikacija tokena
            const decodedToken = jwt.verify(token, exports.secretKey);
            const userType = decodedToken.userType;
            // provera da li je odgovarajuca rola
            if (!allowedUserTypes.includes(userType)) {
                return 401; // data rola nema pristup
            }
            return 200; // validan token i ispravna rola
        }
        catch (error) {
            return 403; // verifikacija neuspesna
        }
    }
}
exports.Utility = Utility;
//# sourceMappingURL=utility.js.map