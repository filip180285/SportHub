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
exports.EventController = void 0;
const event_1 = __importDefault(require("../models/event"));
const user_1 = __importDefault(require("../models/user"));
const schedule = require("node-schedule");
const nodemailer = require("nodemailer");
schedule.scheduleJob("1 0 * * *", () => {
    console.log("filip");
});
class EventController {
    constructor() {
        this.test = (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log("kakakakaka");
        });
        /**
         * Pomocna metoda za slanje mejlova.
         * @param {string} subscribersEmails - Mejlovi razdvojeni sa ", ".
         * @param {string} subject - Naslov mejla.
         * @param {string} html - Sadrzaj mejla.
        */
        this.sendEmail = (subscribersEmails, subject, html) => {
            const transporter = nodemailer.createTransport({
                host: process.env.HOST,
                port: parseInt(process.env.PORT, 10),
                secure: true,
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASS
                }
            });
            const mailOptions = {
                from: process.env.EMAIL,
                to: subscribersEmails,
                subject: subject,
                html: html
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                }
                else {
                    console.log('Emails sent: ' + info.response);
                }
            });
        };
        /**
         * Dohvatanje aktuelnih dogadjaja.
         * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
         * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
         * @returns {Object} JSON objekat sa nizom aktuelnih dogadjaja ili odgovarajucom porukom
         */
        this.getAllActiveEvents = (req, res) => {
            event_1.default.find({ status: "aktivan" })
                .sort({ dateTime: 1 }) // vrati prvo najskorije dogadjaje
                .exec((err, events) => {
                if (err) {
                    return res.status(400).json({ "message": "Greška pri dohvatanju aktuelnih dogadjaja!" });
                }
                else
                    res.json(events);
            });
        };
        /**
         * Dohvatanje aktuelnih dogadjaja organizatora.
         * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
         * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
         * @returns {Object} JSON objekat sa nizom aktuelnih dogadjaja ili odgovarajucom porukom
         */
        this.getAllActiveEventsForOrganiser = (req, res) => {
            const username = req.body.username; // korisnicko ime organizatora
            event_1.default.find({ "organiser": username, status: "aktivan" })
                .sort({ dateTime: 1 }) // vrati prvo najskorije dogadjaje
                .exec((err, events) => {
                if (err) {
                    return res.status(400).json({ "message": "Greška pri dohvatanju aktuelnih dogadjaja organizatora!" });
                }
                else
                    res.json(events);
            });
        };
        /**
         * Dohvatanje prethodnih dogadjaja organizatora.
         * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
         * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
         * @returns {Object} JSON objekat sa nizom aktuelnih dogadjaja ili odgovarajucom porukom
         */
        this.getAllPreviousEventsForOrganiser = (req, res) => {
            const organiser = req.body.organiser; // korisnicko ime organizatora
            event_1.default.find({ "organiser": organiser, status: "zavrsen" })
                .sort({ dateTime: -1 }) // vrati prvo najskorije dogadjaje
                .exec((err, events) => {
                if (err) {
                    return res.status(400).json({ "message": "Greška pri dohvatanju prethodnih dogadjaja!" });
                }
                else
                    res.json(events);
            });
        };
        /**
          * Dodavanje novog dogadjaja i obavestavanje organizatorovih subscriber-a putem mejla.
          * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
          * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
          * @returns {Object} JSON objekat sa odgovarajucom porukom
          */
        this.newEvent = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // id novog dogadjaja
                let id = 1;
                const events = yield event_1.default.find().sort({ "id": -1 }).limit(1);
                if (events.length > 0) {
                    id = events[0].id + 1;
                }
                const organiserUsername = req.body.organiser;
                const sport = req.body.sport;
                const pollDeadline = req.body.pollDeadline;
                const minParticipants = req.body.minParticipants;
                const maxParticipants = req.body.maxParticipants;
                const dateTime = req.body.dateTime;
                const location = req.body.location;
                const eventPrice = req.body.eventPrice;
                const comments = [];
                const participants = [];
                const newEvent = new event_1.default({
                    id: id,
                    organiser: organiserUsername,
                    sport: sport,
                    pollDeadline: pollDeadline,
                    minParticipants: minParticipants,
                    maxParticipants: maxParticipants,
                    dateTime: dateTime,
                    location: location,
                    status: "aktivan",
                    eventPrice: eventPrice,
                    pricePerUser: 0,
                    comments: comments,
                    participants: participants
                });
                const savedEvent = yield newEvent.save();
                // dohvatanje objekta organizatora
                const organizer = yield user_1.default.findOne({ "username": organiserUsername });
                // dohvatanje korisnickih mejlova
                const subscribersEmails = yield user_1.default.find({
                    "username": { $in: organizer.subscriptions }
                }).select('email');
                if (subscribersEmails.length == 0) {
                    return res.status(200).json({
                        "message": "Uspešno ste dodali novi dogadjaj!"
                    });
                }
                const date = new Date(dateTime);
                const deadline = new Date(pollDeadline);
                const options = {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                };
                const formatDate = (date) => date.toLocaleString('en-GB', options);
                const emails = subscribersEmails.join(', ');
                const title = "Novi događaj";
                const content = `<p>Novi događaj organizatora <strong> ${organizer.name} ${organizer.lastname} </strong></p>
      <p><strong>Sport:</strong> ${sport} </p>
      <p><strong>Datum:</strong> ${formatDate(date)} </p>
      <p><strong>Lokacija:</strong> ${location} </p>
      <p><strong>Rok za prijavu:</strong> ${formatDate(deadline)} </p>`;
                this.sendEmail(emails, title, content);
                return res.status(200).json({
                    "message": "Uspešno ste dodali novi događaj!"
                });
            }
            catch (error) {
                return res.status(400).json({
                    "message": "Došlo je do greške prilikom dodavanja događaja!"
                });
            }
        });
        /**
       * Otkazivanje dogadjaja i obavestavanje pretplatnika organizatora.
       * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
       * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
       * @returns {Object} JSON objekat sa odgovarajucom porukom
       */
        this.cancelEvent = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const eventId = req.body.eventId; // id dogadjaja koji se otkazuje
            const organiserUsername = req.body.organiser; // korisnicko ime organizatora
            try {
                // pronalazenje dogadjaja i postavljanje statusa na otkazan
                const event = yield event_1.default.findOne({ "id": eventId });
                event.status = 'otkazan';
                yield event.save();
                const options = {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                };
                const formatDate = (date) => date.toLocaleString('en-GB', options);
                const date = new Date(event.dateTime);
                // dohvatanje organizatora
                const organiser = yield user_1.default.findOne({ "username": organiserUsername });
                // dohvatanje korisnickih mejlova
                const subscribersEmails = yield user_1.default.find({
                    "username": { $in: organiser.subscriptions }
                }).select('email');
                const emails = subscribersEmails.join(', ');
                const title = "Otkazan događaj";
                const content = `<p>Otkazan događaj organizatora <strong> ${organiser.name} ${organiser.lastname} </strong></p>
      <p><strong>Sport:</strong> ${event.sport} </p>
      <p><strong>Datum:</strong> ${formatDate(date)} </p>
      <p><strong>Lokacija:</strong> ${event.location} </p>`;
                this.sendEmail(emails, title, content);
                return res.json({ message: 'Dogadjaj je uspešno otkazan.' });
            }
            catch (error) {
                return res.status(400).json({ message: 'Greška prilikom otkazivanja dogadjaja.', error });
            }
        });
    }
}
exports.EventController = EventController;
//# sourceMappingURL=event.controller.js.map