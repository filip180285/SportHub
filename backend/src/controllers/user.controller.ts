import * as express from 'express';
import User from '../models/user';
const path = require("path");
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client();
const axios = require('axios');

export class UserController {

    /**
     * Obrada zahteva za prijavu korisnika.
     * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
     * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
     * @returns {Object} JSON objekat sa JWT tokenom ili odgovarajucom porukom
     */
    login = async (req: express.Request, res: express.Response) => {
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
            console.log(error);
            return res.status(400).json({ "message": "Greška prilikom prijave!", error });
        }
    }

    /**
    * Obrada zahteva za registraciju korisnika.
    * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
    * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
    * @returns {Object} JSON objekat sa odgovarajucom porukom
    */
    register = async (req: express.Request, res: express.Response) => {
        const username: string = req.body.username;
        const email: string = req.body.email;

        try {
            // provera da li je slobodno korisnicko ime
            const user = await User.findOne({ "username": username });
            if (user) {
                return res.status(400).json({ "message": "Korisničko ime je zauzeto!" });
            }

            // provera da li je slobodan mejl
            const user2 = await User.findOne({ "email": email });
            if (user2) {
                return res.status(400).json({ "message": "Mejl je zauzet!" });
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
            const type: string = req.body.type;
            const phone: string = req.body.phone;
            const description: string = req.body.description;

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
                description: description,
                picture: "",
                subscriptions: subscriptions
            });

            const savedUser = await newUser.save();
            return res.status(200).json({
                "message": "Uspešno ste se registrovali kao " + type + "!"
            });
        } catch (error) {
            console.log(error);
            return res.status(400).json({
                "message": "Došlo je do greške prilikom slanja zahteva za registraciju!", error
            });
        }
    }

    /**
    * Obrada prijave preko Google naloga, dodavanje novog korisnika ako nije prethodno registrovan.
    * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
    * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
    * @returns {Object} JSON objekat sa JWT tokenom ili odgovarajucom porukom
    */
    googleSignIn = async (req: express.Request, res: express.Response) => {
        const googleToken: string = req.body.token;

        try {
            // verifikacija tokena
            const ticket = await client.verifyIdToken({
                idToken: googleToken,
                audience: process.env.GOOGLE_CLIENT_ID
            });
            console.log("tiket")
            console.log(ticket)
            const payload = ticket.getPayload();
            console.log(payload)
            console.log("payload")
            const email = payload.email;

            const user = await User.findOne({ "email": email });

            // aktivan korisnik
            if (user && user.status == "aktivan") {
                const jwtData = {
                    username: user.username,
                    name: user.name,
                    lastname: user.lastname,
                    role: user.type
                }

                // kreiranje i potpis tokena
                const token = jwt.sign(jwtData, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
                return res.status(200).json({ token });
            }
            // obrisan korisnik
            else if (user && user.status == "neaktivan") {
                return res.status(400).json({ "message": "Ne možete se prijaviti sa ovim mejlom!" });
            }

            // id novog korisnika
            let id: number = 1;
            const users = await User.find().sort({ "id": -1 }).limit(1);
            if (users.length > 0) {
                id = users[0].id + 1;
            }

            // kreiramo novog korisnika
            const name: string = payload.given_name;
            const lastname: string = payload.family_name;
            const picture: string = payload.picture;
            const subscriptions: Array<string> = [];

            // generisanje jedinstvenog korisnickog imena
            let _id: number = 1;
            const generatedUsername: string = payload.given_name.toLowerCase() + _id;
            let username: string = generatedUsername;
            while (true) {
                const userWithSameUsername = await User.findOne({ "username": username });
                if (!userWithSameUsername) {
                    break;
                }
                _id++;
                username = `${generatedUsername}${_id}`;
            }

            const newUser = new User({
                id: id,
                name: name,
                lastname: lastname,
                username: username,
                password: "",
                email: email,
                type: "",
                status: "aktivan",
                phone: "",
                description: "",
                picture: picture,
                subscriptions: subscriptions
            });

            const savedUser = await newUser.save();
            return res.status(200).json({
                "message": "Uspešna registracija! Popunite preostala polja!",
                id
            });
        } catch (error) {
            console.error(error);
            return res.status(400).json({ "message": "Greška pri prijavi sa Google nalogom!" });
        }
    }

    /**
  * Dopuna podataka prilikom prijave sa Google nalogom.
  * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
  * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
  * @returns {Object} JSON objekat sa JWT tokenom ili odgovarajucom porukom
  */
    finishGoogleSignIn = async (req: express.Request, res: express.Response) => {
        const id = req.body.id;
        const phone = req.body.phone;
        const type = req.body.type;
        const description = req.body.description;

        try {
            const updateResult = await User.updateOne(
                { "id": id },
                {
                    $set: {
                        "phone": phone,
                        "type": type,
                        "description": description
                    }
                }
            );

            // nalazenje novog korisnika
            const newUser = await User.findOne({ "id": id });

            const jwtData = {
                username: newUser.username,
                name: newUser.name,
                lastname: newUser.lastname,
                role: newUser.type
            };

            // kreiranje i potpis tokena
            const token = jwt.sign(jwtData, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
            return res.status(200).json({ "message": "Uspešna registracija sa Google nalogom!", token });
        } catch (error) {
            console.error(error);
            return res.status(400).json({ "message": "Greška pri dopuni podataka!", error });
        }
    }

    /**
    * Dodavanje i preimenovanje profilne slike za novog korisnika pri registraciji.
    * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
    * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
    * @returns {Object} JSON objekat sa odgovarajucom porukom
    */
    addPicture = (req: express.Request, res: express.Response) => {
        const file: Express.Multer.File = req.file;
        const username: string = req.body.username;

        if (!file) {
            return res.status(400).json({
                "message": "Slika nije priložena!"
            });
        }

        const myArray: Array<string> = file.originalname.split(".");
        const pictureName: string = username + Date.now() +  "." + myArray[myArray.length - 1];
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
                console.log(error);
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
    getUser = (req: express.Request, res: express.Response) => {
        const username: string = req.body.username;
        User.findOne({ "username": username }, (error, user) => {
            if (error) {
                console.log(error);
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
    getUserPicture = async (req, res) => {
        const picture = req.query.image;
        try {
            if (!picture.includes("googleusercontent")) { // uploadovana slika
                return res.sendFile(path.join(__dirname, `../../uploads/users/${picture}`));
            }
            else { // slika sa gugl servera
                const imageUrl = picture;
                const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
                const imageBuffer = Buffer.from(response.data, 'base64');
                const contentType = response.headers['content-type'];
                res.set('Content-Type', contentType);
                res.send(imageBuffer);
            }
        } catch (error) {
            console.log(error);
            return res.status(400).json({ "message": "Greška pri dohvatanju slike korisnika!", error });
        }
    };

    /**
    * Dohvatanje profilne slike korisnika
    * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
    * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
    * @returns {Object} Profilna slika korisnika
    */
    getPictureByUsername = async (req, res) => {
        try {
            const user = await User.findOne({ "username": req.query.username });
            if (user.picture == "") { // nema slike
                return res.sendFile(path.join(__dirname, `../../uploads/users/unknownuser.png`));
            }
            else if (user.picture != "" && !user.picture.includes("googleusercontent")) { // uploadovana slika
                return res.sendFile(path.join(__dirname, `../../uploads/users/${user.picture}`));
            }
            else { // slika sa gugl servera
                const imageUrl = user.picture;
                const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
                const imageBuffer = Buffer.from(response.data, 'base64');
                const contentType = response.headers['content-type'];
                res.set('Content-Type', contentType);
                res.send(imageBuffer);
            }
        } catch (error) {
            console.log(error);
            return res.status(400).json({ "message": "Greška pri dohvatanju slike korisnika!", error });
        }
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
                    console.log(error);
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
                    console.log(error);
                    return res.status(400).json({ "message": "Greška pri dohvatanju organizatora!", error });
                } else {
                    res.status(200).json(organizers);
                }
            });
    };

    /**
    * Dohvatanje svih aktivnih organizatora.
    * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
    * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
    * @returns {Object} JSON objekat sa nizom svih organizatora ili odgovarajuca poruka
    */
    getAllActiveOrganisers = (req: express.Request, res: express.Response) => { // ok
        const exclude = {
            "_id": 0,
            "id": 0,
            "password": 0,
            "email": 0,
            "phone": 0,
            "type": 0,
            "status": 0,
            "subscriptions": 0
        };

        User.find({ "type": "organizator", "status": "aktivan" }, exclude)
            .sort({ "username": 1 })
            .exec((error, organizers) => {
                if (error) {
                    console.log(error);
                    return res.status(400).json({ "message": "Greška pri dohvatanju aktivnih organizatora!", error });
                } else {
                    res.status(200).json(organizers);
                }
            });
    };

    /**
    * Promena statusa korisnika na neaktivan.
    * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
    * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
    * @returns {Object} JSON objekat sa odgovarajucom porukom
    */
    deleteUser = (req: express.Request, res: express.Response) => {
        const username:string = req.body.username;

        User.collection.updateOne({ "username": username }, { $set: { status: "neaktivan" } }, (error, success) => {
            if (error) {
                console.log(error);
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
    updateUser = async (req: express.Request, res: express.Response) => {
        const username = req.body.username;
        const phone = req.body.phone;
        const email = req.body.email;
        const description = req.body.description != undefined ? req.body.description : "";

        try {
            const existingUser = await User.findOne({ email: email });
            if (existingUser && existingUser.username != username) {
                return res.status(400).json({ "message": "Mejl je zauzet." });
            }

            User.collection.updateOne(
                { "username": username },
                {
                    $set: {
                        "phone": phone,
                        "email": email,
                        "description": description
                    }
                },
                (error, success) => {
                    if (error) {
                        console.log(error);
                        return res.status(400).json({ "message": "Greška pri ažuriranju podataka!", error });
                    } else {
                        res.status(200).json({ "message": "Podaci su ažurirani!" });
                    }
                });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ "message": "Internal server error.", error });
        }
    }

    /**
 * Subscribe-ovanje korisnika na nekog organizatora.
 * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
 * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
 * @returns {Object} JSON objekat sa odgovarajucom porukom
 */
    subscribe = async (req: express.Request, res: express.Response) => {
        const username: string = req.body.username; // korisnicko ime ucesnika
        const orgUsername: string = req.body.orgUsername; // korisnicko ime organizatora

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
            console.log(error);
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
        const username: string = req.body.username; // korisnicko ime ucesnika
        const orgUsername: string = req.body.orgUsername; // korisnicko ime organizatora

        try {
            // trazenje korisnika
            const participant = await User.findOne({ "username": username });
            const organizer = await User.findOne({ "username": orgUsername });

            // uklanjanje organizatora iz ucesnikovih pretplata
            const orgIndex = participant.subscriptions.indexOf(orgUsername);
            if (orgIndex != -1) {
                participant.subscriptions.splice(orgIndex, 1);
                await participant.save();
            }

            // uklanjanje ucesnika iz organizatorovih pretplata
            const participantIndex = organizer.subscriptions.indexOf(username);
            if (participantIndex != -1) {
                organizer.subscriptions.splice(participantIndex, 1);
                await organizer.save();
            }

            return res.status(200).json({ "message": 'Uspešno ste se odjavili od organizatora!' });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ "message": 'Greška pri odjavi od organizatora!', error });
        }
    }
}
