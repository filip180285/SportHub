import * as express from 'express';
import User from '../models/user';
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
    login = async (req: express.Request, res: express.Response) => { // ok
        const username: string = req.body.username;
        const password: string = req.body.password;

        try {
            const user = await User.findOne({ "username": username, "status": "aktivan" });

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
            const token = jwt.sign(jwtData, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
            return res.status(200).json({ token });
        } catch (error) {
            return res.status(400).json({ "message": "Greška prilikom prijave!", error });
        }
    }

    /**
    * Obrada zahteva za registraciju korisnika.
    * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
    * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
    * @returns {Object} JSON objekat sa odgovarajucom porukom
    */
    register = async (req: express.Request, res: express.Response) => { // ok
        const username: string = req.body.username;

        try {
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

            const subscriptions: Array<string> = [];

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

            const savedUser = await newUser.save();
            return res.status(200).json({
                "message": "Uspešno ste se registrovali kao " + type + "!"
            });
        } catch (error) {
            return res.status(400).json({
                "message": "Došlo je do greške prilikom slanja zahteva za registraciju!", error
            });
        }
    }

    /**
    * Dodavanje i preimenovanje profilne slike za novog korisnika pri registraciji.
    * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
    * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
    * @returns {Object} JSON objekat sa odgovarajucom porukom
    */
    addPicture = (req: express.Request, res: express.Response) => { // ok
        const file: Express.Multer.File = req.file;
        const username: string = req.body.username;

        if (!file) {
            return res.status(400).json({
                "message": "Slika nije priložena!"
            });
        }

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
            try {
                await User.collection.updateOne({ "username": username }, { $set: { "picture": pictureName } });
                return res.status(200).json({
                    "message": "Dodata profilna slika u bazu!"
                });
            } catch (error) {
                return res.status(400).json({
                    "message": "Greška pri ažuriranju korisnika u bazi!", error
                });
            }
        });
    }

    /**
    * Dohvatanje korisnika.
    * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
    * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
    * @returns {Object} JSON objekat korisnika ili odgovarajuca poruka
    */
    getUser = (req: express.Request, res: express.Response) => { // ok
        const username:string = req.body.username;
        User.findOne({ "username": username }, (error, user) => {
            if (error) {
                return res.status(400).json({ "message": "Greška pri dohvatanju korisnika!", error });
            }
            else {
                const { _id, id, password, ...userData } = user._doc;
                res.status(200).json(userData);
            }
        });
    }

    /**
    * Dohvatanje profilne slike korisnika
    * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
    * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
    * @returns {Object} Profilna slika korisnika
    */
    getUserPicture = (req, res) => { // ok
        return res.sendFile(path.join(__dirname, `../../uploads/users/${req.query.image}`));
    };

    /**
    * Dohvatanje svih ucesnika.
    * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
    * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
    * @returns {Object} JSON objekat sa nizom svih ucesnika
    */
    getAllParticipants = (req: express.Request, res: express.Response) => { // ok
        User.find({ "type": "ucesnik" }, { "_id": 0, "id": 0, "password": 0 })
            .sort({ "status": 1, "username": 1 })
            .exec((error, participants) => {
                if (error) {
                    return res.status(400).json({ "message": "Greška pri dohvatanju učesnika!", error });
                } else {
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
    getAllOrganisers = (req: express.Request, res: express.Response) => { // ok
        User.find({ "type": "organizator" }, { "_id": 0, "id": 0, "password": 0 })
            .sort({ "status": 1, "username": 1 })
            .exec((error, organizers) => {
                if (error) {
                    return res.status(400).json({ "message": "Greška pri dohvatanju organizatora!", error });
                } else {
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
    deleteUser = (req: express.Request, res: express.Response) => { // ok
        const username = req.body.username;

        User.collection.updateOne({ "username": username }, { $set: { status: "neaktivan" } }, (error, success) => {
            if (error) {
                return res.status(400).json({ "message": "Greška pri brisanju korisnika!", error });
            }
            else res.status(200).json({ "message": "Korisnik je obrisan!" })
        })
    }

    /**
   * Azuriranje podataka korisnika.
   * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
   * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
   * @returns {Object} JSON objekat sa odgovarajucom porukom
   */
    updateUser = (req: express.Request, res: express.Response) => { // ok
        const username = req.body.username;
        const phone = req.body.phone;
        const email = req.body.email;

        User.collection.updateOne(
            { "username": username },
            {
                $set: {
                    "phone": phone,
                    "email": email
                }
            },
            (error, success) => {
                if (error) {
                    return res.status(400).json({ "message": "Greška pri ažuriranju podataka!", error });
                }
                else {
                    res.status(200).json({ message: "Podaci su ažurirani!" });
                }
            })
    }

    /**
 * Subscribe-ovanje korisnika na nekog organizatora.
 * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
 * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
 * @returns {Object} JSON objekat sa odgovarajucom porukom
 */
    subscribe = async (req: express.Request, res: express.Response) => {
        const username:string = req.body.username; // korisnicko ime ucesnika
        const orgUsername:string = req.body.orgUsername; // korisnicko ime organizatora

        try {
            // trazenje korisnika
            const participant = await User.findOne({ "username": username });
            const organizer = await User.findOne({ "username": orgUsername });

            // dodavanje organizatora u ucesnikove pretplate
            if (!participant.subscriptions.includes(orgUsername)) {
                participant.subscriptions.push(orgUsername);
                await participant.save();
            }

            // dodavanje ucesnika u organizatorove pretplate
            if (!organizer.subscriptions.includes(username)) {
                organizer.subscriptions.push(username);
                await organizer.save();
            }

            return res.status(200).json({ "message": 'Uspešno ste se pretplatili na organizatora!' });
        } catch (error) {
            return res.status(400).json({ "message": 'Greška pri pretplati na organizatora!', error });
        }
    };

    /**
 * Odjava korisnika od nekog organizatora.
 * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
 * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
 * @returns {Object} JSON objekat sa odgovarajucom porukom
 */
    unsubscribe = async (req: express.Request, res: express.Response) => {
        const username:string = req.body.username; // korisnicko ime ucesnika
        const orgUsername:string = req.body.orgUsername; // korisnicko ime organizatora

        try {
            // trazenje korisnika
            const participant = await User.findOne({ "username": username });
            const organizer = await User.findOne({ "username": orgUsername });

            // Removing organizer from participant's subscriptions
            const orgIndex = participant.subscriptions.indexOf(orgUsername);
            if (orgIndex != -1) {
                participant.subscriptions.splice(orgIndex, 1);
                await participant.save();
            }

            // Removing participant from organizer's subscriptions
            const participantIndex = organizer.subscriptions.indexOf(username);
            if (participantIndex != -1) {
                organizer.subscriptions.splice(participantIndex, 1);
                await organizer.save();
            }

            return res.status(200).json({ "message": 'Uspešno ste se odjavili od organizatora!' });
        } catch (error) {
            return res.status(400).json({ "message": 'Greška pri odjavi od organizatora!', error });
        }
    };


    test = async (req: express.Request, res: express.Response) => { // ok
        const orgUsername:string = req.body.username;
        //console.log(username)
        User.findOne({ "username": "jovica" }, (err, user) => {
            if (err) {
                return res.status(400).json({ "message": "Greška pri prijavi korisnika!" });
            }
            else {
                // Exclude the 'password' field from the 'user' object
                const { password, email, ...userData } = user._doc;
                //console.log(user);
                console.log(userData);
                // Send all the other fields in a new object
                res.status(200).json(userData);
            }
        });
    }
}