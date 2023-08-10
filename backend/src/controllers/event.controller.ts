import * as express from 'express';
import Event from '../models/event';
import User from '../models/user';
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

export class EventController {

  /**
   * Pomocna metoda za slanje mejlova.
   * @param {string} emails - Mejlovi razdvojeni sa ", ".
   * @param {string} subject - Naslov mejla.
   * @param {string} html - Sadrzaj mejla.
   * @returns {void}
  */
  sendEmail = async (emails: string, subject: string, html: string) => {
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
    * Dohvatanje pojedinacnog dogadjaja.
    * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
    * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
    * @returns {Object} JSON objekat dogadjaja ili odgovarajuca poruka
    */
  getEvent = (req: express.Request, res: express.Response) => {
    const id: number = req.body.eventId;
    Event.findOne({ "id": id }, (error, event) => {
      if (error) {
        console.log(error);
        return res.status(400).json({ "message": "Greška pri dohvatanju pojedinačnog događaja!", error });
      }
      else {
        return res.status(200).json(event);
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
      .sort({ "dateTime": -1 }) // vrati prvo najskorije dogadjaje
      .exec((error, events) => {
        if (error) {
          console.log(error);
          return res.status(400).json({ "message": "Greška pri dohvatanju aktuelnih dogadjaja!", error });
        }
        else return res.status(200).json(events);
      });
  }

  /**
   * Dohvatanje prethodnih dogadjaja ucesnika.
   * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
   * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
   * @returns {Object} JSON objekat sa nizom dogadjaja ili odgovarajucom porukom
   */
  getAllPreviousEventsForParticipant = async (req: express.Request, res: express.Response) => {
    const username: string = req.body.username; // korisnicko ime ucesnika

    try {
      const events = await Event.find({ "participants": username, status: "zavrsen" })
        .sort({ dateTime: -1 }) // vrati prvo najskorije dogadjaje
      return res.status(200).json(events);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ "message": "Greška pri dohvatanju prethodnih dogadjaja!", error });
    }
  };

  /**
   * Dohvatanje aktuelnih dogadjaja organizatora.
   * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
   * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
   * @returns {Object} JSON objekat sa nizom aktuelnih dogadjaja ili odgovarajucom porukom
   */
  getAllActiveEventsForOrganiser = (req: express.Request, res: express.Response) => {
    const username: string = req.body.username; // korisnicko ime organizatora

    Event.find({ "organiser": username, status: "aktivan" })
      .sort({ "dateTime": -1 }) // vrati prvo najskorije dogadjaje
      .exec((error, events) => {
        if (error) {
          console.log(error);
          return res.status(400).json({ "message": "Greška pri dohvatanju aktuelnih dogadjaja organizatora!", error });
        }
        else return res.status(200).json(events);
      });
  }

  /**
   * Dohvatanje prethodnih dogadjaja organizatora.
   * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
   * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
   * @returns {Object} JSON objekat sa nizom dogadjaja ili odgovarajucom porukom
   */
  getAllPreviousEventsForOrganiser = (req: express.Request, res: express.Response) => {
    const organiser: string = req.body.username; // korisnicko ime organizatora

    Event.find({ "organiser": organiser, status: "zavrsen" })
      .sort({ "dateTime": -1 }) // vrati prvo najskorije dogadjaje
      .exec((error, events) => {
        if (error) {
          console.log(error);
          return res.status(400).json({ "message": "Greška pri dohvatanju prethodnih dogadjaja!", error });
        }
        else return res.status(200).json(events);
      });
  }

  /**
   * Dohvatanje ucesnika dogadjaja.
   * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
   * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
   * @returns {Object} JSON objekat sa nizom ucesnika ili odgovarajucom porukom
   */
  getEventParticipants = async (req, res) => {
    const eventId = req.body.eventId;

    try {
      const event = await Event.findOne({ "id": eventId });
      const participants = await User.find({ "username": { $in: event.participants } })
        .select('-id -password -_id -subscriptions').sort({ "username": 1 });
      return res.status(200).json(participants);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ "message": 'Greška pri dohvatanju učesnika', error });
    }
  };

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
      const organiserName: string = req.body.name;
      const organiserLastname: string = req.body.lastname;
      const now: number = req.body.now;
      const sport: string = req.body.sport;
      const pollDeadline: number = req.body.pollDeadline;
      const minParticipants: number = req.body.minParticipants;
      const maxParticipants: number = req.body.maxParticipants;
      const dateTime: number = req.body.dateTime;
      const location: string = req.body.location;
      const eventPrice: number = req.body.eventPrice;

      // kreiranje novog komentara
      const newComment = {
        id: 1,
        username: organiserUsername,
        name: organiserName,
        lastname: organiserLastname,
        datetime: now,
        text: "Pozdrav, ja sam organizator ovog događaja. Ovde možete da ostavite svoj komentar vezan za ovaj događaj.",
      };


      const comments: Array<Object> = [];
      comments.push(newComment);
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
      console.log(error);
      return res.status(400).json({
        "message": "Došlo je do greške prilikom dodavanja događaja!",
        error
      });
    }
  }

  /**
 * Otkazivanje dogadjaja i obavestavanje pretplatnika organizatora.
 * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
 * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
 * @returns {Object} JSON objekat sa odgovarajucom porukom
 */
  cancelEvent = async (req: express.Request, res: express.Response) => {
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

      return res.status(200).json({ "message": "Događaj je uspešno otkazan!" });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ "message": "Greška prilikom otkazivanja dogadjaja!", error });
    }
  };

  /**
 * Prijava ucesnika za dogadjaj.
 * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
 * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
 * @returns {Object} JSON objekat sa odgovarajucom porukom
 */
  applyForEvent = async (req: express.Request, res: express.Response) => {
    const username: string = req.body.username; // korisnicko ime ucesnika
    const eventId: number = req.body.eventId; // id dogadjaja
    try {
      // trazenje dogadjaja
      const event = await Event.findOne({ "id": eventId });
      if (event.participants.length >= event.maxParticipants) {
        return res.status(400).json({ "message": "Došlo je do greške pri prijavi za događaj." });
      }

      // dodavanje ucesnika u niz
      if (!event.participants.includes(username)) {
        event.participants.push(username);
        await event.save();
      }

      return res.status(200).json({ "message": "Uspešno ste se prijavili za događaj." });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ "message": "Došlo je do greške pri prijavi za događaj.", error });
    }
  };

  /**
 * Odjava ucesnika sa dogadjaja.
 * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
 * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
 * @returns {Object} JSON objekat sa odgovarajucom porukom
 */
  cancelApplication = async (req: express.Request, res: express.Response) => {
    const username: string = req.body.username; // korisnicko ime ucesnika
    const eventId: number = req.body.eventId; // id dogadjaja
    try {
      // trazenje dogadjaja
      const event = await Event.findOne({ "id": eventId });

      // uklanjanje ucesnika iz niza
      if (event.participants.includes(username)) {
        event.participants = event.participants.filter((participant) => participant != username);
        await event.save();
      }

      return res.status(200).json({ "message": "Uspešno ste odjavili učešće sa događaja." });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ "message": "Došlo je do greške pri odjavi sa događaja.", error });
    }
  };

  /**
   * Komentarisanje dogadjaja.
   * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
   * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
   * @returns {Object} JSON objekat sa odgovarajucom porukom
   */
  addComment = async (req: express.Request, res: express.Response) => {
    const username: string = req.body.username;
    const eventId: number = req.body.eventId;
    const name: string = req.body.name;
    const lastname: string = req.body.lastname;
    const text: string = req.body.text;
    const datetime: number = req.body.datetime;

    try {
      // nadji dogadjaj sa prosledjenim id
      const event = await Event.findOne({ "id": eventId });

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

      // dodavanje novog komentara u niz komentara
      event.comments.push(newComment);
      await event.save();

      return res.status(200).json({ "message": "Komentar uspešno dodat!", newComment });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ "message": "Greška pri dodavanju komentara!", error });
    }
  };

  /**
  * Svi dogadjaji koje ucesnik nije jos uvek platio i ukupan dug.
  * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
  * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
  * @returns {Object} JSON objekat sa nizom dogadjaja i totalnim dugom
  */
  findOwingEventsForParticipant = async (req: express.Request, res: express.Response) => {
    const username: string = req.body.username;
    try {
      // trazi sve dogadjaje za koje je ucesnik duzan
      const events = await Event.find({
        "status": "zavrsen",
        "participants": username,
        "paid": { $nin: [username] }
      }).sort({ "dateTime": -1 });

      // racuna ukupan dug korisnika
      let totalOwing = 0;
      for (const event of events) {
        totalOwing += event.pricePerUser;
      }

      return res.status(200).json({ events, totalOwing });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ "message": "Došlo je do greške prilikom dohvatanja događaja.", error });
    }
  };

  /**
 * Svi dogadjaji organizatora za koje postoje dugovanja
 * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
 * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
 * @returns {Object} JSON objekat sa nizom dogadjaja ili odgovarajucom porukom
 */
  findOwingEventsForOrganiser = async (req: express.Request, res: express.Response) => {
    const username: string = req.body.username;
    try {
      // pronalazenje svih dogadjaja organizatora
      const events = await Event.find({ "status": "zavrsen", "organiser": username }).sort({ "dateTime": -1 });

      // filtriranje dogadjaja za koje postoje dugovanja
      const eventsWithOwing = events.filter((event) => (event.paid).length < (event.participants).length);

      return res.status(200).json({ eventsWithOwing });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ "message": "Došlo je do greške prilikom dohvatanja događaja.", error });
    }
  };

  /**
  * Azuriranje placanja
  * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
  * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
  * @returns {Object} JSON objekat sa odgovarajucom porukom
  */
  updatePayments = async (req: express.Request, res: express.Response) => {
    const eventId: number = req.body.eventId; // id dogadjaja
    const paidArray: Array<string> = req.body.paid; // niz ucesnika koji su platili
    try {
      // pronalazenje dogadjaja
      const event = await Event.findOne({ "id": eventId });

      // azuriranje placanja
      event.paid = paidArray;
      await event.save();

      return res.status(200).json({ "message": "Plaćanje je uspešno ažurirano." });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ "message": "Došlo je do greske prilikom ažuriranja plaćanja.", error });
    }
  };


  /**
 * Azuriranje statusa dogadjaja i cene po korisniku, slanje mejla kao podsetnika
 * na dogadjaj.
 */
  updateEventsStatus = async () => {
    const now: number = Date.now();
    try {
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
      console.log(error);
      console.log("Došlo je do greške!", error);
    }
  };

  /**
 * Otkazivanje dogadjaja koji nisu ispunili minimalan broj ucesnika, slanje
 * mejla za obavestenje o otkazanom dogadjaju
 */
  cancelEventsWithoutMinimum = async () => {
    const now: number = Date.now();
    try {
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
      console.log(error);
      console.log("Došlo je do greške!", error);
    }
  };

}