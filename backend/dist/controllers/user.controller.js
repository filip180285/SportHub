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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_1 = __importDefault(require("../models/user"));
const path = require("path");
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
class UserController {
    constructor() {
        /**
         * Obrada zahteva za prijavu korisnika.
         * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
         * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
         * @returns {Object} JSON objekat sa JWT tokenom ili odgovarajucom porukom
         */
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const username = req.body.username;
            const password = req.body.password;
            try {
                const user = yield user_1.default.findOne({ "username": username, "status": "aktivan" });
                if (!user) {
                    return res.status(400).json({ "message": "Neispravni kredencijali!" });
                }
                // provera da li je lozinka ispravna
                const isPasswordMatch = yield bcrypt.compare(password, user.password);
                if (!isPasswordMatch) {
                    return res.status(400).json({ "message": "Neispravni kredencijali!" });
                }
                const jwtData = {
                    username: user.username,
                    name: user.name,
                    lastname: user.lastname,
                    role: user.type
                };
                // kreiranje i potpis tokena
                const token = jwt.sign(jwtData, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
                return res.status(200).json({ token });
            }
            catch (error) {
                return res.status(400).json({ "message": "Greška prilikom prijave!", error });
            }
        });
        /**
        * Obrada zahteva za registraciju korisnika.
        * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
        * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
        * @returns {Object} JSON objekat sa odgovarajucom porukom
        */
        this.register = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const username = req.body.username;
            try {
                const user = yield user_1.default.findOne({ "username": username });
                if (user) {
                    return res.status(400).json({ "message": "Korisničko ime je zauzeto!" });
                }
                // id novog korisnika
                let id = 1;
                const users = yield user_1.default.find().sort({ "id": -1 }).limit(1);
                if (users.length > 0) {
                    id = users[0].id + 1;
                }
                const name = req.body.name;
                const lastname = req.body.lastname;
                const password = req.body.password;
                const email = req.body.email;
                const type = req.body.type;
                const phone = req.body.phone;
                const subscriptions = [];
                const saltRounds = 10;
                const hashedPassword = yield bcrypt.hash(password, saltRounds);
                const newUser = new user_1.default({
                    id: id,
                    name: name,
                    lastname: lastname,
                    username: username,
                    password: hashedPassword,
                    email: email,
                    type: type,
                    status: "aktivan",
                    phone: phone,
                    picture: "",
                    subscriptions: subscriptions
                });
                const savedUser = yield newUser.save();
                return res.status(200).json({
                    "message": "Uspešno ste se registrovali kao " + type + "!"
                });
            }
            catch (error) {
                return res.status(400).json({
                    "message": "Došlo je do greške prilikom slanja zahteva za registraciju!", error
                });
            }
        });
        /**
        * Dodavanje i preimenovanje profilne slike za novog korisnika pri registraciji.
        * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
        * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
        * @returns {Object} JSON objekat sa odgovarajucom porukom
        */
        this.addPicture = (req, res) => {
            const file = req.file;
            const username = req.body.username;
            if (!file) {
                return res.status(400).json({
                    "message": "Slika nije priložena!"
                });
            }
            const myArray = file.originalname.split(".");
            const pictureName = username + Date.now() + "." + myArray[myArray.length - 1];
            // preimenovanje dodate slike
            fs.rename(file.path, path.join(__dirname, "../../uploads/users/" + pictureName), (err) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    return res.status(400).json({
                        "message": "Greška pri dodavanju slike u bazu!"
                    });
                }
                // promena naziva polja picture u kolekciji User
                try {
                    yield user_1.default.collection.updateOne({ "username": username }, { $set: { "picture": pictureName } });
                    return res.status(200).json({
                        "message": "Dodata profilna slika u bazu!"
                    });
                }
                catch (error) {
                    return res.status(400).json({
                        "message": "Greška pri ažuriranju korisnika u bazi!", error
                    });
                }
            }));
        };
        /**
        * Dohvatanje korisnika.
        * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
        * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
        * @returns {Object} JSON objekat korisnika ili odgovarajuca poruka
        */
        this.getUser = (req, res) => {
            const username = req.body.username;
            user_1.default.findOne({ "username": username }, (error, user) => {
                if (error) {
                    return res.status(400).json({ "message": "Greška pri dohvatanju korisnika!", error });
                }
                else {
                    const _a = user._doc, { _id, id, password } = _a, userData = __rest(_a, ["_id", "id", "password"]);
                    res.status(200).json(userData);
                }
            });
        };
        /**
        * Dohvatanje profilne slike korisnika
        * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
        * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
        * @returns {Object} Profilna slika korisnika
        */
        this.getUserPicture = (req, res) => {
            return res.sendFile(path.join(__dirname, `../../uploads/users/${req.query.image}`));
        };
        /**
        * Dohvatanje slike za dogadjaj
        * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
        * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
        * @returns {Object} Slika
        */
        this.getPictureByUsername = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const user = yield user_1.default.findOne({ "username": req.query.username });
            return res.sendFile(path.join(__dirname, `../../uploads/users/${user.picture}`));
        });
        /**
        * Dohvatanje svih ucesnika.
        * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
        * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
        * @returns {Object} JSON objekat sa nizom svih ucesnika
        */
        this.getAllParticipants = (req, res) => {
            user_1.default.find({ "type": "ucesnik" }, { "_id": 0, "id": 0, "password": 0 })
                .sort({ "status": 1, "username": 1 })
                .exec((error, participants) => {
                if (error) {
                    return res.status(400).json({ "message": "Greška pri dohvatanju učesnika!", error });
                }
                else {
                    return res.status(200).json(participants);
                }
            });
        };
        /**
        * Dohvatanje svih organizatora.
        * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
        * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
        * @returns {Object} JSON objekat sa nizom svih organizatora
        */
        this.getAllOrganisers = (req, res) => {
            user_1.default.find({ "type": "organizator" }, { "_id": 0, "id": 0, "password": 0 })
                .sort({ "status": 1, "username": 1 })
                .exec((error, organizers) => {
                if (error) {
                    return res.status(400).json({ "message": "Greška pri dohvatanju organizatora!", error });
                }
                else {
                    res.status(200).json(organizers);
                }
            });
        };
        /**
        * Dohvatanje svih organizatora.
        * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
        * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
        * @returns {Object} JSON objekat sa nizom svih organizatora
        */
        this.getAllActiveOrganisers = (req, res) => {
            user_1.default.find({ "type": "organizator", "status": "aktivan" }, { "_id": 0, "id": 0, "password": 0 })
                .sort({ "username": 1 })
                .exec((error, organizers) => {
                if (error) {
                    return res.status(400).json({ "message": "Greška pri dohvatanju aktivnih organizatora!", error });
                }
                else {
                    res.status(200).json(organizers);
                }
            });
        };
        /**
        * Promena statusa korinika na neaktivan.
        * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
        * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
        * @returns {Object} JSON objekat sa odgovarajucom porukom
        */
        this.deleteUser = (req, res) => {
            const username = req.body.username;
            user_1.default.collection.updateOne({ "username": username }, { $set: { status: "neaktivan" } }, (error, success) => {
                if (error) {
                    return res.status(400).json({ "message": "Greška pri brisanju korisnika!", error });
                }
                else
                    res.status(200).json({ "message": "Korisnik je obrisan!" });
            });
        };
        /**
       * Azuriranje podataka korisnika.
       * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
       * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
       * @returns {Object} JSON objekat sa odgovarajucom porukom
       */
        this.updateUser = (req, res) => {
            const username = req.body.username;
            const phone = req.body.phone;
            const email = req.body.email;
            user_1.default.collection.updateOne({ "username": username }, {
                $set: {
                    "phone": phone,
                    "email": email
                }
            }, (error, success) => {
                if (error) {
                    return res.status(400).json({ "message": "Greška pri ažuriranju podataka!", error });
                }
                else {
                    res.status(200).json({ message: "Podaci su ažurirani!" });
                }
            });
        };
        /**
     * Subscribe-ovanje korisnika na nekog organizatora.
     * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
     * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
     * @returns {Object} JSON objekat sa odgovarajucom porukom
     */
        this.subscribe = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const username = req.body.username; // korisnicko ime ucesnika
            const orgUsername = req.body.orgUsername; // korisnicko ime organizatora
            try {
                // trazenje korisnika
                const participant = yield user_1.default.findOne({ "username": username });
                const organizer = yield user_1.default.findOne({ "username": orgUsername });
                // dodavanje organizatora u ucesnikove pretplate
                if (!participant.subscriptions.includes(orgUsername)) {
                    participant.subscriptions.push(orgUsername);
                    yield participant.save();
                }
                // dodavanje ucesnika u organizatorove pretplate
                if (!organizer.subscriptions.includes(username)) {
                    organizer.subscriptions.push(username);
                    yield organizer.save();
                }
                return res.status(200).json({ "message": 'Uspešno ste se pretplatili na organizatora!' });
            }
            catch (error) {
                return res.status(400).json({ "message": 'Greška pri pretplati na organizatora!', error });
            }
        });
        /**
     * Odjava korisnika od nekog organizatora.
     * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
     * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
     * @returns {Object} JSON objekat sa odgovarajucom porukom
     */
        this.unsubscribe = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const username = req.body.username; // korisnicko ime ucesnika
            const orgUsername = req.body.orgUsername; // korisnicko ime organizatora
            try {
                // trazenje korisnika
                const participant = yield user_1.default.findOne({ "username": username });
                const organizer = yield user_1.default.findOne({ "username": orgUsername });
                // Removing organizer from participant's subscriptions
                const orgIndex = participant.subscriptions.indexOf(orgUsername);
                if (orgIndex != -1) {
                    participant.subscriptions.splice(orgIndex, 1);
                    yield participant.save();
                }
                // Removing participant from organizer's subscriptions
                const participantIndex = organizer.subscriptions.indexOf(username);
                if (participantIndex != -1) {
                    organizer.subscriptions.splice(participantIndex, 1);
                    yield organizer.save();
                }
                return res.status(200).json({ "message": 'Uspešno ste se odjavili od organizatora!' });
            }
            catch (error) {
                return res.status(400).json({ "message": 'Greška pri odjavi od organizatora!', error });
            }
        });
        this.test = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const orgUsername = req.body.username;
            //console.log(username)
            user_1.default.findOne({ "username": "jovica" }, (err, user) => {
                if (err) {
                    return res.status(400).json({ "message": "Greška pri prijavi korisnika!" });
                }
                else {
                    // Exclude the 'password' field from the 'user' object
                    const _a = user._doc, { password, email } = _a, userData = __rest(_a, ["password", "email"]);
                    //console.log(user);
                    console.log(userData);
                    // Send all the other fields in a new object
                    res.status(200).json(userData);
                }
            });
        });
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map