import { Request, Response, NextFunction } from "express";

const jwt = require('jsonwebtoken');
const crypto = require('crypto');

export const secretKey = crypto.randomBytes(32).toString('hex');

export const verifyTokenMiddleware = (allowedUserTypes: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const token: string = req.headers.authorization?.split(' ')[1] || '';

        if (!token) {
            return res.status(400).json({ message: "Nema tokena u zaglavlju!" });
        }

        try {
            // verifikacija tokena
            const decodedToken: any = jwt.verify(token, secretKey);
            const role = decodedToken.role;

            // provera da li je odgovarajuca uloga
            if (!allowedUserTypes.includes(role)) {
                return res.status(401).json({ message: "Nemate pristup ovoj usluzi!" });
            }

            // ako je sve u redu, obraditi zahtev
            next();
        } catch (error) {
            return res.status(403).json({ message: "Vaša sesija je istekla!" });
        }
    };
};
