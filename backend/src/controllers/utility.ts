const jwt = require('jsonwebtoken');

export const secretKey = 'JWT_SECRET_KEY';

export class Utility {

    static verifyToken(token: string, allowedUserTypes: string[]): number {
        if (!token) {
            return 400; // nema tokena u zaglavlju 
        }

        try {
            // verifikacija tokena
            const decodedToken: any = jwt.verify(token, secretKey);
            const role = decodedToken.role;

            // provera da li je odgovarajuca rola
            if (!allowedUserTypes.includes(role)) {
                return 401; // data rola nema pristup
            }

            return 200; // validan token i ispravna rola
        } catch (error) {
            return 403; // verifikacija neuspesna
        }
    }
}
