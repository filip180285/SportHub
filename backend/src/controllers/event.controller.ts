import * as express from 'express';
import Event from '../models/event';
import User from '../models/user';
const schedule = require("node-schedule");
const nodemailer = require("nodemailer");

schedule.scheduleJob("1 6 * * *", () => {
  console.log("filip");
});

schedule.scheduleJob("5 0 * * *", () => {
  new EventController().cancelEventsWithoutMinimum();
});

schedule.scheduleJob("10 0 * * *", () => {
  new EventController().updateEventsStatus();
});

const options = {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
};

const formatDate = (date) => date.toLocaleString('en-GB', options);

export class EventController {

  test = async (req: express.Request, res: express.Response) => { // ok
    console.log("kakakakaka")
  }

  /**
   * Pomocna metoda za slanje mejlova.
   * @param {string} emails - Mejlovi razdvojeni sa ", ".
   * @param {string} subject - Naslov mejla.
   * @param {string} html - Sadrzaj mejla.
  */
  sendEmail = async (emails: string, subject: string, html: string) => { // ok
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
      } else {
        console.log('Emails sent: ' + info.response);
      }
    });
  }

  /**
   * Dohvatanje aktuelnih dogadjaja.
   * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
   * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
   * @returns {Object} JSON objekat sa nizom aktuelnih dogadjaja ili odgovarajucom porukom
   */
  getAllActiveEvents = (req: express.Request, res: express.Response) => {
    Event.find({ "status": "aktivan" })
      .sort({ "dateTime": 1 }) // vrati prvo najskorije dogadjaje
      .exec((err, events) => {
        if (err) {
          return res.status(400).json({ "message": "Greška pri dohvatanju aktuelnih dogadjaja!" });
        }
        else res.json(events);
      });
  }

  /**
   * Dohvatanje aktuelnih dogadjaja organizatora.
   * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
   * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
   * @returns {Object} JSON objekat sa nizom aktuelnih dogadjaja ili odgovarajucom porukom
   */
  getAllActiveEventsForOrganiser = (req: express.Request, res: express.Response) => {
    const username: string = req.body.username; // korisnicko ime organizatora

    Event.find({ "organiser": username, status: "aktivan" })
      .sort({ "dateTime": 1 }) // vrati prvo najskorije dogadjaje
      .exec((err, events) => {
        if (err) {
          return res.status(400).json({ "message": "Greška pri dohvatanju aktuelnih dogadjaja organizatora!" });
        }
        else res.json(events);
      });
  }

  /**
   * Dohvatanje prethodnih dogadjaja organizatora.
   * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
   * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
   * @returns {Object} JSON objekat sa nizom aktuelnih dogadjaja ili odgovarajucom porukom
   */
  getAllPreviousEventsForOrganiser = (req: express.Request, res: express.Response) => {
    const organiser: string = req.body.organiser; // korisnicko ime organizatora

    Event.find({ "organiser": organiser, status: "zavrsen" })
      .sort({ "dateTime": -1 }) // vrati prvo najskorije dogadjaje
      .exec((err, events) => {
        if (err) {
          return res.status(400).json({ "message": "Greška pri dohvatanju prethodnih dogadjaja!" });
        }
        else res.json(events);
      });
  }

  /**
    * Dodavanje novog dogadjaja i obavestavanje organizatorovih subscriber-a putem mejla.
    * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
    * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
    * @returns {Object} JSON objekat sa odgovarajucom porukom
    */
  newEvent = async (req: express.Request, res: express.Response) => { // ok
    try {
      // id novog dogadjaja
      let id: number = 1;
      const events = await Event.find().sort({ "id": -1 }).limit(1);
      if (events.length > 0) {
        id = events[0].id + 1;
      }

      const organiserUsername: string = req.body.organiser;
      const sport: string = req.body.sport;
      const pollDeadline: number = req.body.pollDeadline;
      const minParticipants: number = req.body.minParticipants;
      const maxParticipants: number = req.body.maxParticipants;
      const dateTime: number = req.body.dateTime;
      const location: string = req.body.location;
      const eventPrice: number = req.body.eventPrice;

      const comments: Array<Object> = [];
      const participants: Array<string> = [];

      const newEvent = new Event({
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

      await newEvent.save();

      // dohvatanje objekta organizatora
      const organizer = await User.findOne({ "username": organiserUsername });
      // dohvatanje korisnickih mejlova
      const subscribersEmails = await User.find({
        "username": { $in: organizer.subscriptions }
      }).select('email');

      if (subscribersEmails.length == 0) {
        return res.status(200).json({
          "message": "Uspešno ste dodali novi dogadjaj!"
        });
      }

      const date = new Date(dateTime);
      const deadline = new Date(pollDeadline);

      const emails: string = subscribersEmails.join(', ');
      const title: string = "Novi događaj";
      const content: string =
        `<p>Novi događaj organizatora <strong> ${organizer.name} ${organizer.lastname} </strong></p>
      <p><strong>Sport:</strong> ${sport} </p>
      <p><strong>Datum:</strong> ${formatDate(date)} </p>
      <p><strong>Lokacija:</strong> ${location} </p>
      <p><strong>Rok za prijavu:</strong> ${formatDate(deadline)} </p>`;

      this.sendEmail(emails, title, content);

      return res.status(200).json({
        "message": "Uspešno ste dodali novi događaj!"
      });

    } catch (error) {
      return res.status(400).json({
        "message": "Došlo je do greške prilikom dodavanja događaja!"
      });
    }
  }

  /**
 * Otkazivanje dogadjaja i obavestavanje pretplatnika organizatora.
 * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
 * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
 * @returns {Object} JSON objekat sa odgovarajucom porukom
 */
  cancelEvent = async (req: express.Request, res: express.Response) => { // ok
    const eventId: number = req.body.eventId; // id dogadjaja koji se otkazuje
    const organiserUsername: string = req.body.organiser; // korisnicko ime organizatora

    try {
      // pronalazenje dogadjaja i postavljanje statusa na otkazan
      const event = await Event.findOne({ "id": eventId });
      event.status = 'otkazan';
      await event.save();

      const date = new Date(event.dateTime);
      // dohvatanje organizatora
      const organiser = await User.findOne({ "username": organiserUsername });
      // dohvatanje mejlova ucesnika
      const participants = event.participants;
      const participantsEmails = await User.find({ "username": { $in: participants } }).select('email');

      if (participantsEmails.length == 0) {
        return res.status(200).json({
          "message": "Događaj je uspešno otkazan!"
        });
      }

      const emails: string = participantsEmails.join(', ');
      const title: string = "Otkazan događaj";
      const content: string =
        `<p>Otkazan događaj organizatora <strong> ${organiser.name} ${organiser.lastname} </strong></p>
      <p><strong>Sport:</strong> ${event.sport} </p>
      <p><strong>Datum:</strong> ${formatDate(date)} </p>
      <p><strong>Lokacija:</strong> ${event.location} </p>`;

      this.sendEmail(emails, title, content);

      return res.json({ "message": "Događaj je uspešno otkazan!" });
    } catch (error) {
      return res.status(400).json({ "message": 'Greška prilikom otkazivanja dogadjaja!', error });
    }
  };

  /**
   * Prijava ucesnika za dogadjaj.
   * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
   * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
   * @returns {Object} JSON objekat sa odgovarajucom porukom
   */
  applyForEvent = (req: express.Request, res: express.Response) => {
    const username = req.body.username; // korisnicko ime ucesnika
    const eventId = req.body.id; // korisnicko ime ucesnika


  }

  /**
   * Komentarisanje dogadjaja.
   * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
   * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
   * @returns {Object} JSON objekat sa odgovarajucom porukom
   */
  addComment = async (req: express.Request, res: express.Response) => {
    const username: string = req.body.username;
    const eventId: number = req.body.id;
    const name: string = req.body.name;
    const lastname: string = req.body.lastname;
    const text: string = req.body.text;
    const datetime: number = req.body.datetime;

    try {
      // nadji dogadjaj sa prosledjenim id
      const event = await Event.findOne({ "id": eventId });

      // id novog komentara
      const lastComment = event.comments[event.comments.length - 1];
      const newCommentId = lastComment ? lastComment.id + 1 : 1;

      // Create a new comment object with the new ID
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
      await event.save();

      return res.status(200).json({ "message": "Komentar uspešno dodat!", comment: newComment });
    } catch (error) {
      return res.status(400).json({ "message": "Greška pri dodavanju komentara!", error });
    }
  };

  /**
 * Azuriranje statusa dogadjaja i cene po korisniku, slanje mejla kao podsetnika
 * na dogadjaj.
 */
  updateEventsStatus = async () => {
    try {
      const now = Date.now();

      // nalazenje aktuelnih dogadjaja kojima je istekao rok za prijavu
      const events = await Event.find({ "status": "aktivan", "pollDeadline": { $lt: now } });

      // azurira status dogadjaja i racuna cenu po korisniku
      for (const event of events) {
        event.status = "zavrsen";
        // cena za ucesnika = cena termina / broj ucesnika
        const pricePerUser = Number((event.eventPrice / event.participants.length).toFixed(2));
        event.pricePerUser = pricePerUser;
        await event.save();
      }

      // slanje mejlova
      for (const event of events) {
        const participants = event.participants;
        // dohvatanje mejlova ucesnika
        const participantsEmails = await User.find({ "username": { $in: participants } }).select('email');
        const emails: string = participantsEmails.join(', ');
        const date = new Date(event.dateTime);
        // mejl podsetnik
        const title: string = "Podsetnik";
        const content: string =
          `<p><strong>Današnji događaj:</strong></p>
        <p><strong>Sport:</strong> ${event.sport} </p>
        <p><strong>Datum:</strong> ${formatDate(date)} </p>
        <p><strong>Lokacija:</strong> ${event.location} </p>`;
        // poziv metode za slanje mejlova
        this.sendEmail(emails, title, content);
      }

      console.log("Uspešno ažurirani događaji!");
    } catch (error) {
      console.log("Došlo je do greške!", error);
    }
  };

  /**
 * Otkazivanje dogadjaja koji nisu ispunili minimalan broj ucesnika, slanje
 * mejla za obavestenje o otkazanom dogadjaju
 */
  cancelEventsWithoutMinimum = async () => {
    try {
      const now = Date.now();

      // Find aktivan dogadjaja kojima je istekao rok za prijavu i ima manje ucesnika od minParticipants
      const events = await Event.find({
        "status": "aktivan",
        "pollDeadline": { $lt: now },
        $expr: { $lt: [{ $size: "$participants" }, "$minParticipants"] }
      });

      // Azurira status dogadjaja
      for (const event of events) {
        event.status = "otkazan";
        await event.save();
      }

      // Slanje mejlova
      for (const event of events) {
        const participants = event.participants;
        // Dohvatanje mejlova ucesnika
        const participantsEmails = await User.find({ "username": { $in: participants } }).select('email');
        if (participantsEmails.length == 0) {
          continue;
        }
        const emails: string = participantsEmails.join(', ');
        const date = new Date(event.dateTime);
        // Mejlovi podsetnici
        const title: string = "Otkazan događaj";
        const content: string =
          `<p><strong>Današnji događaj je otkazan zbog nedovoljnog broja učesnika:</strong></p>
        <p><strong>Sport:</strong> ${event.sport} </p>
        <p><strong>Datum:</strong> ${formatDate(date)} </p>
        <p><strong>Lokacija:</strong> ${event.location} </p>`;
        // poziv metode za slanje mejlova
        this.sendEmail(emails, title, content);
      }
      console.log("Uspešno otkazani događaji!");
    } catch (error) {
      console.log("Došlo je do greške!", error);
    }
  };



}