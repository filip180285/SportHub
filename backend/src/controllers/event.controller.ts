import * as express from 'express';
import Event from '../models/event';
import User from '../models/user';
const schedule = require("node-schedule");
const nodemailer = require("nodemailer");

schedule.scheduleJob("1 0 * * *", () => {
  console.log("filip");
})

export class EventController {

  test = async (req: express.Request, res: express.Response) => { // ok
    console.log("kakakakaka")
  }

  /**
   * Pomocna metoda za slanje mejlova.
   * @param {string} subscribersEmails - Mejlovi razdvojeni sa ", ".
   * @param {string} subject - Naslov mejla.
   * @param {string} html - Sadrzaj mejla.
  */
  sendEmail = (subscribersEmails: string, subject: string, html: string) => { // ok
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
    Event.find({ status: "aktivan" })
      .sort({ dateTime: 1 }) // vrati prvo najskorije dogadjaje
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
    const username = req.body.username; // korisnicko ime organizatora

    Event.find({ "organiser": username, status: "aktivan" })
      .sort({ dateTime: 1 }) // vrati prvo najskorije dogadjaje
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
    const organiser = req.body.organiser; // korisnicko ime organizatora

    Event.find({ "organiser": organiser, status: "zavrsen" })
      .sort({ dateTime: -1 }) // vrati prvo najskorije dogadjaje
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

      const savedEvent = await newEvent.save();

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

      const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      };

      const formatDate = (date) => date.toLocaleString('en-GB', options);

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
    const eventId = req.body.eventId; // id dogadjaja koji se otkazuje
    const organiserUsername = req.body.organiser; // korisnicko ime organizatora

    try {
      // pronalazenje dogadjaja i postavljanje statusa na otkazan
      const event = await Event.findOne({ "id": eventId });
      event.status = 'otkazan';
      await event.save();

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
      const organiser = await User.findOne({ "username": organiserUsername });
      // dohvatanje korisnickih mejlova
      const subscribersEmails = await User.find({
        "username": { $in: organiser.subscriptions }
      }).select('email');

      const emails: string = subscribersEmails.join(', ');
      const title: string = "Otkazan događaj";
      const content: string =
      `<p>Otkazan događaj organizatora <strong> ${organiser.name} ${organiser.lastname} </strong></p>
      <p><strong>Sport:</strong> ${event.sport} </p>
      <p><strong>Datum:</strong> ${formatDate(date)} </p>
      <p><strong>Lokacija:</strong> ${event.location} </p>`;

      this.sendEmail(emails, title, content);

      return res.json({ message: 'Dogadjaj je uspešno otkazan.' });
    } catch (error) {
      return res.status(400).json({ message: 'Greška prilikom otkazivanja dogadjaja.', error });
    }
  };




}