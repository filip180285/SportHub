"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SportController = void 0;
const sport_1 = __importDefault(require("../models/sport"));
const path = require("path");
class SportController {
    constructor() {
        /**
        * Dohvatanje svih sportova.
        * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
        * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
        * @returns {Object} JSON objekat sa nizom svih sportova
        */
        this.getAllSports = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const sports = yield sport_1.default.find({}, { "id": 0, "_id": 0 });
                return res.status(200).json(sports);
            }
            catch (error) {
                return res.status(400).json({ "message": "Greška pri dohvatanju sportova!", error });
            }
        });
        /**
        * Dohvatanje slike za dogadjaj
        * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
        * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
        * @returns {Object} Slika
        */
        this.getSportPicture = (req, res) => {
            return res.sendFile(path.join(__dirname, `../../uploads/sports/${req.query.image}`));
        };
    }
}
exports.SportController = SportController;
//# sourceMappingURL=sport.controller.js.map