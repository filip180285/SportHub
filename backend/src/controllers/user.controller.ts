import * as express from 'express';
import User from '../models/user';
const path = require("path");
const fs = require('fs');

export class UserController {

    /**
     * Obrada zahteva za prijavu korisnika.
     * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
     * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
     */
    login = (req: express.Request, res: express.Response) => {
        const username: string = req.body.username;
        const password: string = req.body.password;

        // trazenje korisnika sa prosledjenim kredencijalima
        User.findOne({ "username": username, "password": password, "status": "aktivan" }, (err, user) => {
            if (err) {
                return res.status(400).json({ "message": "Greska pri prijavi korisnika!" });
                console.log(err);
            }
            else return res.json(user);
        })
    }

    /**
    * Obrada zahteva za registraciju korisnika.
    * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
    * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
    */
    register = async (req: express.Request, res: express.Response) => { // ok
        const username: string = req.body.username;

        const user = await User.findOne({ "username": username });
        if (user) {
            return res.status(400).json({ "message": "Korisnicko ime je zauzeto!" });
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

        const newUser = new User({
            id: id,
            name: name,
            lastname: lastname,
            username: username,
            password: password,
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
                        "message": "Greska pri dodavanju slike u bazu!"
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
                "message": "Greska pri dodavanju slike u bazu!"
            });
        }
    }

    test = async (req: express.Request, res: express.Response) => { // ok
        /*const user = await User.find().sort({ id: -1 }).limit(1);
        console.log(user[0].id);
        return res.status(400).json({
            "message": "loseeeee!",
        });*/

        /*return res.status(200).json({
            "message": "oke!",
        });
        res.status(200).json({
            "message": "loseeeee!",
        })*/
        return res.status(200).json({
            "message": "prva!",
            "message2" : "druga"
        });

    }
}