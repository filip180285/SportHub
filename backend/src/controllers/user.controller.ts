import * as express from 'express';
import User from '../models/user';
import { secretKey } from './utility';
import { Utility } from './utility';
const path = require("path");
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

export class UserController {

    /**
     * Obrada zahteva za prijavu korisnika.
     * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
     * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
     * @returns {Object} JSON objekat sa JWT tokenom ili odgovarajucom porukom
     */
    login = (req: express.Request, res: express.Response) => { // ok
        const username: string = req.body.username;
        const password: string = req.body.password;

        User.findOne({ "username": username, "status": "aktivan" }, async (err, user) => {
            if (err) {
                return res.status(400).json({ "message": "Greška pri prijavi korisnika!" });
            }

            if (!user) {
                return res.status(400).json({ "message": "Neispravni kredencijali!" });
            }

            // provera da li je lozinka ispravna
            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if (!isPasswordMatch) {
                return res.status(400).json({ "message": "Neispravni kredencijali!" });
            }

            const jwtData = {
                username: user.username,
                name: user.name,
                lastname: user.lastname,
                role: user.type
            }
            // kreiranje i potpis tokena
            const token = jwt.sign(jwtData, secretKey, { expiresIn: '1h' });
            return res.json({ token });
        });
    }

    /**
    * Obrada zahteva za registraciju korisnika.
    * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
    * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
    * @returns {Object} JSON objekat sa odgovarajucom porukom
    */
    register = async (req: express.Request, res: express.Response) => { // ok
        const username: string = req.body.username;

        const user = await User.findOne({ "username": username });
        if (user) {
            return res.status(400).json({ "message": "Korisničko ime je zauzeto!" });
        }
        // id novog korisnika
        let id: number = 1;
        const users = await User.find().sort({ "id": -1 }).limit(1);
        if (users.length > 0) {
            id = users[0].id + 1;
        }

        const name: string = req.body.name;
        const lastname: string = req.body.lastname;
        const password: string = req.body.password;
        const email: string = req.body.email;
        const type: string = req.body.type;
        const phone: string = req.body.phone;

        const subscriptions: Array<number> = [];

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
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

        newUser.save().then(user => {
            console.log(user);
            return res.status(200).json(
                {
                    "message": "Uspešno ste se registrovali kao " + type + "!"
                });
        }).catch(err => {
            return res.status(400).json(
                {
                    "message": "Došlo je do greške prilikom slanja zahteva za registraciju!"
                });
        })
    }

    /**
    * Dodavanje i preimenovanje profilne slike za novog korisnika pri registraciji.
    * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
    * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
    * @returns {Object} JSON objekat odgovarajucom porukom
    */
    addPicture = (req: express.Request, res: express.Response) => { // ok
        const file: Express.Multer.File = req.file;
        const username: string = req.body.username;

        if (file) {
            const myArray: Array<string> = file.originalname.split(".");
            const pictureName: string = username + Date.now() + "." + myArray[myArray.length - 1];
            // preimenovanje dodate slike
            fs.rename(file.path, path.join(__dirname, "../../uploads/users/" + pictureName), async (err) => {
                if (err) {
                    return res.status(400).json({
                        "message": "Greška pri dodavanju slike u bazu!"
                    });
                }
                // promena naziva polja picture u kolekciji User
                await User.collection.updateOne({ "username": username }, { $set: { "picture": pictureName } });
                return res.status(200).json({
                    "message": "Dodata profilna slika u bazu!"
                });
            });
        }
        else {
            return res.status(400).json({
                "message": "Greška pri dodavanju slike u bazu!"
            });
        }
    }

    getUser = (req: express.Request, res: express.Response) => {
        const token: string = req.headers.authorization?.split(' ')[1] || '';
        const allowedUserTypes: string[] = ["ucesnik", "organizator", "administrator"];
        const statusCode = Utility.verifyToken(token, allowedUserTypes);

        if (statusCode == 400) { // zahtev bez tokena
            return res.status(statusCode).json({ message: "Nema tokena u zaglavlju!" });
        } else if (statusCode == 401) {  // pogresna rola
            return res.status(statusCode).json({ message: "Nemate pristup ovoj usluzi!" });
        } else if (statusCode == 403) { // token istekao
            return res.status(statusCode).json({ message: "Vaša sesija je istekla! Prijavite se ponovo!" });
        }

        const username = req.body.username;
        console.log(username)
        User.findOne({ "username": username }, (err, user) => {
            if (err) console.log(err);
            else res.json(user)
        })
    }

    getUserPicture = (req, res) => {
        res.sendFile(path.join(__dirname, `../../uploads/users/${req.query.image}`));
    };

    test = async (req: express.Request, res: express.Response) => { // ok

    }

    testJWT = async (req: express.Request, res: express.Response) => { // ok
        const token: string = req.headers.authorization?.split(' ')[1] || '';
        const allowedUserTypes: string[] = ['organizator', 'admin'];
        const statusCode = Utility.verifyToken(token, allowedUserTypes);

        if (statusCode == 400) { // zahtev bez tokena
            return res.status(statusCode).json({ message: "Nema tokena u zaglavlju!" });
        } else if (statusCode == 401) {  // pogresna rola
            return res.status(statusCode).json({ message: "Nemate pristup ovoj usluzi!" });
        } else if (statusCode == 403) { // token istekao
            return res.status(statusCode).json({ message: "Istekao token!" });
        }

        return res.status(statusCode).json({ message: "SVE OK!" });

    }
}