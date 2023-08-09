import express from 'express';
import { EventController } from '../controllers/event.controller';
import { verifyTokenMiddleware } from '../middleware/middleware';
const eventRouter = express.Router();

eventRouter.route("/test").post( // testiranje
  (req, res) => new EventController().test(req, res)
);

eventRouter.route("/getEvent").post(
  verifyTokenMiddleware(["ucesnik", "organizator", "administrator"]),
  (req, res) => new EventController().getEvent(req, res)
);

eventRouter.route("/getAllActiveEvents").get(
  verifyTokenMiddleware(["ucesnik"]),
  (req, res) => new EventController().getAllActiveEvents(req, res)
);

eventRouter.route("/getAllPreviousEventsForParticipant").post(
  verifyTokenMiddleware(["ucesnik", "administrator"]),
  (req, res) => new EventController().getAllPreviousEventsForParticipant(req, res)
);

eventRouter.route("/getAllActiveEventsForOrganiser").post(
  verifyTokenMiddleware(["organizator"]),
  (req, res) => new EventController().getAllActiveEventsForOrganiser(req, res)
);

eventRouter.route("/getAllPreviousEventsForOrganiser").post(
  verifyTokenMiddleware(["organizator", "administrator"]),
  (req, res) => new EventController().getAllPreviousEventsForOrganiser(req, res)
);

eventRouter.route("/getEventParticipants").post(
  verifyTokenMiddleware(["organizator", "administrator"]),
  (req, res) => new EventController().getEventParticipants(req, res)
);

eventRouter.route("/newEvent").post(
  verifyTokenMiddleware(["organizator"]),
  (req, res) => new EventController().newEvent(req, res)
);

eventRouter.route("/cancelEvent").post(
  verifyTokenMiddleware(["organizator"]),
  (req, res) => new EventController().cancelEvent(req, res)
);

eventRouter.route("/applyForEvent").post(
  verifyTokenMiddleware(["ucesnik"]),
  (req, res) => new EventController().applyForEvent(req, res)
);

eventRouter.route("/cancelApplication").post(
  verifyTokenMiddleware(["ucesnik"]),
  (req, res) => new EventController().cancelApplication(req, res)
);

eventRouter.route("/addComment").post(
  verifyTokenMiddleware(["ucesnik", "organizator"]),
  (req, res) => new EventController().addComment(req, res)
);

eventRouter.route("/findOwingEventsForParticipant").post(
  verifyTokenMiddleware(["ucesnik", "administrator"]),
  (req, res) => new EventController().findOwingEventsForParticipant(req, res)
);

eventRouter.route("/findOwingEventsForOrganiser").post(
  verifyTokenMiddleware(["organizator"]),
  (req, res) => new EventController().findOwingEventsForOrganiser(req, res)
);

eventRouter.route("/updatePayments").post(
  verifyTokenMiddleware(["organizator", "administrator"]),
  (req, res) => new EventController().updatePayments(req, res)
);

export default eventRouter;