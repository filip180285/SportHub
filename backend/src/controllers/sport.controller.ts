import * as express from 'express';
import Sport from '../models/sport';
const path = require("path");

export class SportController {

    /**
    * Dohvatanje svih sportova.
    * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
    * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
    * @returns {Object} JSON objekat sa nizom svih sportova
    */
    getAllSports = async (req: express.Request, res: express.Response) => {
        try {
            const sports = await Sport.find({}, { "id": 0, "_id" : 0 });
            return res.status(200).json(sports);
        } catch (error) {
            return res.status(400).json({ "message": "Greška pri dohvatanju sportova!", error });
        }
    };

    /**
    * Dohvatanje slike za dogadjaj
    * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
    * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
    * @returns {Object} Slika
    */
    getSportPicture = (req, res) => { // ok
        return res.sendFile(path.join(__dirname, `../../uploads/sports/${req.query.image}`));
    };

}