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
schedule.scheduleJob("1 6 * * *", () => {
    console.log("filip");
    console.log(Date.now());
});
schedule.scheduleJob("5 0 * * *", () => {
    console.log("cancel");
    new EventController().cancelEventsWithoutMinimum();
    console.log(Date.now());
});
schedule.scheduleJob("10 0 * * *", () => {
    console.log("update");
    new EventController().updateEventsStatus();
    console.log(Date.now());
});
const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
};
const formatDate = (date) => date.toLocaleString('en-GB', options);
class EventController {
    constructor() {
        this.test = (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log("kakakakaka");
        });
        /**
         * Pomocna metoda za slanje mejlova.
         * @param {string} emails - Mejlovi razdvojeni sa ", ".
         * @param {string} subject - Naslov mejla.
         * @param {string} html - Sadrzaj mejla.
        */
        this.sendEmail = (emails, subject, html) => __awaiter(this, void 0, void 0, function* () {
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
                to: emails,
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
        });
        /**
          * Dohvatanje pojedinacnog dogadjaja.
          * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
          * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
          * @returns {Object} JSON objekat dogadjaja ili odgovarajuca poruka
          */
        this.getEvent = (req, res) => {
            const id = req.body.eventId;
            event_1.default.findOne({ "id": id }, (error, event) => {
                if (error) {
                    console.log(error);
                    return res.status(400).json({ "message": "Greška pri dohvatanju pojedinačnog događaja!", error });
                }
                else {
                    return res.status(200).json(event);
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
            event_1.default.find({ "status": "aktivan" })
                .sort({ "dateTime": -1 }) // vrati prvo najskorije dogadjaje
                .exec((error, events) => {
                if (error) {
                    console.log(error);
                    return res.status(400).json({ "message": "Greška pri dohvatanju aktuelnih dogadjaja!", error });
                }
                else
                    return res.status(200).json(events);
            });
        };
        /**
         * Dohvatanje prethodnih dogadjaja ucesnika.
         * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
         * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
         * @returns {Object} JSON objekat sa nizom dogadjaja ili odgovarajucom porukom
         */
        this.getAllPreviousEventsForParticipant = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const username = req.body.username; // korisnicko ime ucesnika
            try {
                const events = yield event_1.default.find({ "participants": username, status: "zavrsen" })
                    .sort({ dateTime: -1 }); // vrati prvo najskorije dogadjaje
                return res.status(200).json(events);
            }
            catch (error) {
                console.log(error);
                return res.status(400).json({ "message": "Greška pri dohvatanju prethodnih dogadjaja!", error });
            }
        });
        /**
         * Dohvatanje aktuelnih dogadjaja organizatora.
         * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
         * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
         * @returns {Object} JSON objekat sa nizom aktuelnih dogadjaja ili odgovarajucom porukom
         */
        this.getAllActiveEventsForOrganiser = (req, res) => {
            const username = req.body.username; // korisnicko ime organizatora
            event_1.default.find({ "organiser": username, status: "aktivan" })
                .sort({ "dateTime": -1 }) // vrati prvo najskorije dogadjaje
                .exec((error, events) => {
                if (error) {
                    console.log(error);
                    return res.status(400).json({ "message": "Greška pri dohvatanju aktuelnih dogadjaja organizatora!", error });
                }
                else
                    return res.status(200).json(events);
            });
        };
        /**
         * Dohvatanje prethodnih dogadjaja organizatora.
         * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
         * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
         * @returns {Object} JSON objekat sa nizom aktuelnih dogadjaja ili odgovarajucom porukom
         */
        this.getAllPreviousEventsForOrganiser = (req, res) => {
            const organiser = req.body.username; // korisnicko ime organizatora
            event_1.default.find({ "organiser": organiser, status: "zavrsen" })
                .sort({ "dateTime": -1 }) // vrati prvo najskorije dogadjaje
                .exec((error, events) => {
                if (error) {
                    console.log(error);
                    return res.status(400).json({ "message": "Greška pri dohvatanju prethodnih dogadjaja!", error });
                }
                else
                    return res.status(200).json(events);
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
                const organiserName = req.body.name;
                const organiserLastname = req.body.lastname;
                const now = req.body.now;
                const sport = req.body.sport;
                const pollDeadline = req.body.pollDeadline;
                const minParticipants = req.body.minParticipants;
                const maxParticipants = req.body.maxParticipants;
                const dateTime = req.body.dateTime;
                const location = req.body.location;
                const eventPrice = req.body.eventPrice;
                // kreiranje novog komentara
                const newComment = {
                    id: 1,
                    username: organiserUsername,
                    name: organiserName,
                    lastname: organiserLastname,
                    datetime: now,
                    text: "Pozdrav, ja sam organizator ovog događaja. Ovde možete da ostavite svoj komentar vezan za ovaj događaj.",
                };
                const comments = [];
                comments.push(newComment);
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
                yield newEvent.save();
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
                console.log(error);
                return res.status(400).json({
                    "message": "Došlo je do greške prilikom dodavanja događaja!",
                    error
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
                const date = new Date(event.dateTime);
                // dohvatanje organizatora
                const organiser = yield user_1.default.findOne({ "username": organiserUsername });
                // dohvatanje mejlova ucesnika
                const participants = event.participants;
                const participantsEmails = yield user_1.default.find({ "username": { $in: participants } }).select('email');
                if (participantsEmails.length == 0) {
                    return res.status(200).json({
                        "message": "Događaj je uspešno otkazan!"
                    });
                }
                const emails = participantsEmails.join(', ');
                const title = "Otkazan događaj";
                const content = `<p>Otkazan događaj organizatora <strong> ${organiser.name} ${organiser.lastname} </strong></p>
      <p><strong>Sport:</strong> ${event.sport} </p>
      <p><strong>Datum:</strong> ${formatDate(date)} </p>
      <p><strong>Lokacija:</strong> ${event.location} </p>`;
                this.sendEmail(emails, title, content);
                return res.status(200).json({ "message": "Događaj je uspešno otkazan!" });
            }
            catch (error) {
                console.log(error);
                return res.status(400).json({ "message": "Greška prilikom otkazivanja dogadjaja!", error });
            }
        });
        /**
       * Prijava ucesnika za dogadjaj.
       * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
       * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
       * @returns {Object} JSON objekat sa odgovarajucom porukom
       */
        this.applyForEvent = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const username = req.body.username; // korisnicko ime ucesnika
            const eventId = req.body.eventId; // id dogadjaja
            try {
                // trazenje dogadjaja
                const event = yield event_1.default.findOne({ "id": eventId });
                if (event.participants.length >= event.maxParticipants) {
                    return res.status(400).json({ "message": "Došlo je do greške pri prijavi za događaj." });
                }
                // dodavanje ucesnika u niz
                if (!event.participants.includes(username)) {
                    event.participants.push(username);
                    yield event.save();
                }
                return res.status(200).json({ "message": "Uspešno ste se prijavili za događaj." });
            }
            catch (error) {
                console.log(error);
                return res.status(400).json({ "message": "Došlo je do greške pri prijavi za događaj.", error });
            }
        });
        /**
       * Odjava ucesnika sa dogadjaja.
       * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
       * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
       * @returns {Object} JSON objekat sa odgovarajucom porukom
       */
        this.cancelApplication = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const username = req.body.username; // korisnicko ime ucesnika
            const eventId = req.body.eventId; // id dogadjaja
            try {
                // trazenje dogadjaja
                const event = yield event_1.default.findOne({ "id": eventId });
                // uklanjanje ucesnika iz niza
                if (event.participants.includes(username)) {
                    event.participants = event.participants.filter((participant) => participant != username);
                    yield event.save();
                }
                return res.status(200).json({ "message": "Uspešno ste odjavili učešće sa događaja." });
            }
            catch (error) {
                console.log(error);
                return res.status(400).json({ "message": "Došlo je do greške pri odjavi sa događaja.", error });
            }
        });
        /**
         * Komentarisanje dogadjaja.
         * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
         * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
         * @returns {Object} JSON objekat sa odgovarajucom porukom
         */
        this.addComment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const username = req.body.username;
            const eventId = req.body.eventId;
            const name = req.body.name;
            const lastname = req.body.lastname;
            const text = req.body.text;
            const datetime = req.body.datetime;
            try {
                // nadji dogadjaj sa prosledjenim id
                const event = yield event_1.default.findOne({ "id": eventId });
                // id novog komentara
                const lastComment = event.comments[event.comments.length - 1];
                const newCommentId = lastComment.id + 1;
                // kreiranje novog komentara
                const newComment = {
                    id: newCommentId,
                    username: username,
                    name: name,
                    lastname: lastname,
                    datetime: datetime,
                    text: text,
                };
                // Update the comments array in the event document
                event.comments.push(newComment);
                yield event.save();
                return res.status(200).json({ "message": "Komentar uspešno dodat!", newComment });
            }
            catch (error) {
                console.log(error);
                return res.status(400).json({ "message": "Greška pri dodavanju komentara!", error });
            }
        });
        /**
        * Svi dogadjaji koje ucesnik nije jos uvek platio i ukupan dug.
        * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
        * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
        * @returns {Object} JSON objekat sa nizom dogadjaja i totalnim dugom
        */
        this.findOwingEventsForParticipant = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const username = req.body.username;
            try {
                // trazi sve dogadjaje za koje je ucesnik duzan
                const events = yield event_1.default.find({
                    status: "zavrsen",
                    participants: username,
                    paid: { $nin: [username] }
                });
                // racuna ukupan dug korisnika
                let totalOwing = 0;
                for (const event of events) {
                    totalOwing += event.pricePerUser;
                }
                return res.status(200).json({ events, totalOwing });
            }
            catch (error) {
                console.log(error);
                return res.status(400).json({ "message": "Došlo je do greške prilikom dohvatanja događaja.", error });
            }
        });
        /**
       * Svi dogadjaji organizatora za koje postoje dugovanja
       * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
       * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
       * @returns {Object} JSON objekat sa nizom dogadjaja ili odgovarajucom porukom
       */
        this.findOwingEventsForOrganiser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const username = req.body.username;
            try {
                // pronalazenje svih dogadjaja organizatora
                const events = yield event_1.default.find({ status: "zavrsen", organiser: username });
                // filtriranje dogadjaja za koje postoje dugovanja
                const eventsWithOwing = events.filter((event) => (event.paid).length < (event.participants).length);
                return res.status(200).json({ eventsWithOwing });
            }
            catch (error) {
                console.log(error);
                return res.status(400).json({ "message": "Došlo je do greške prilikom dohvatanja događaja.", error });
            }
        });
        /**
      * Azuriranje placanja
      * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
      * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
      * @returns {Object} JSON objekat sa odgovarajucom porukom
      */
        this.updatePayments = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const eventId = req.body.eventId; // id dogadjaja
            const paidArray = req.body.paid; // niz ucesnika koji su platili
            try {
                // pronalazenje dogadjaja
                const event = yield event_1.default.findOne({ id: eventId });
                // azuriranje placanja
                event.paid = paidArray;
                yield event.save();
                return res.status(200).json({ "message": "Plaćanje je uspesno ažurirano." });
            }
            catch (error) {
                console.log(error);
                return res.status(400).json({ "message": "Došlo je do greske prilikom ažuriranja placanja.", error });
            }
        });
        /**
       * Azuriranje statusa dogadjaja i cene po korisniku, slanje mejla kao podsetnika
       * na dogadjaj.
       */
        this.updateEventsStatus = () => __awaiter(this, void 0, void 0, function* () {
            const now = Date.now();
            try {
                // nalazenje aktuelnih dogadjaja kojima je istekao rok za prijavu
                const events = yield event_1.default.find({ "status": "aktivan", "pollDeadline": { $lt: now } });
                // azurira status dogadjaja i racuna cenu po korisniku
                for (const event of events) {
                    event.status = "zavrsen";
                    // cena za ucesnika = cena termina / broj ucesnika
                    const pricePerUser = Number((event.eventPrice / event.participants.length).toFixed(2));
                    event.pricePerUser = pricePerUser;
                    yield event.save();
                }
                // slanje mejlova
                for (const event of events) {
                    const participants = event.participants;
                    // dohvatanje mejlova ucesnika
                    const participantsEmails = yield user_1.default.find({ "username": { $in: participants } }).select('email');
                    const emails = participantsEmails.join(', ');
                    const date = new Date(event.dateTime);
                    // mejl podsetnik
                    const title = "Podsetnik";
                    const content = `<p><strong>Današnji događaj:</strong></p>
        <p><strong>Sport:</strong> ${event.sport} </p>
        <p><strong>Datum:</strong> ${formatDate(date)} </p>
        <p><strong>Lokacija:</strong> ${event.location} </p>`;
                    // poziv metode za slanje mejlova
                    this.sendEmail(emails, title, content);
                }
                console.log("Uspešno ažurirani događaji!");
            }
            catch (error) {
                console.log(error);
                console.log("Došlo je do greške!", error);
            }
        });
        /**
       * Otkazivanje dogadjaja koji nisu ispunili minimalan broj ucesnika, slanje
       * mejla za obavestenje o otkazanom dogadjaju
       */
        this.cancelEventsWithoutMinimum = () => __awaiter(this, void 0, void 0, function* () {
            const now = Date.now();
            try {
                // Find aktivan dogadjaja kojima je istekao rok za prijavu i ima manje ucesnika od minParticipants
                const events = yield event_1.default.find({
                    "status": "aktivan",
                    "pollDeadline": { $lt: now },
                    $expr: { $lt: [{ $size: "$participants" }, "$minParticipants"] }
                });
                // Azurira status dogadjaja
                for (const event of events) {
                    event.status = "otkazan";
                    yield event.save();
                }
                // Slanje mejlova
                for (const event of events) {
                    const participants = event.participants;
                    // Dohvatanje mejlova ucesnika
                    const participantsEmails = yield user_1.default.find({ "username": { $in: participants } }).select('email');
                    if (participantsEmails.length == 0) {
                        continue;
                    }
                    const emails = participantsEmails.join(', ');
                    const date = new Date(event.dateTime);
                    // Mejlovi podsetnici
                    const title = "Otkazan događaj";
                    const content = `<p><strong>Današnji događaj je otkazan zbog nedovoljnog broja učesnika:</strong></p>
        <p><strong>Sport:</strong> ${event.sport} </p>
        <p><strong>Datum:</strong> ${formatDate(date)} </p>
        <p><strong>Lokacija:</strong> ${event.location} </p>`;
                    // poziv metode za slanje mejlova
                    this.sendEmail(emails, title, content);
                }
                console.log("Uspešno otkazani događaji!");
            }
            catch (error) {
                console.log(error);
                console.log("Došlo je do greške!", error);
            }
        });
    }
}
exports.EventController = EventController;
//# sourceMappingURL=event.controller.js.map