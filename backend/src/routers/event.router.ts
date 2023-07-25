import express from 'express';
import { EventController } from '../controllers/event.controller';
import { verifyTokenMiddleware } from '../middleware/middleware';
const eventRouter = express.Router();

eventRouter.route("/test").post( // testiranje
  (req, res) => new EventController().test(req, res)
);

eventRouter.route("/getAllActiveEvents").get(
  verifyTokenMiddleware(["ucesnik"]),
  (req, res) => new EventController().getAllActiveEvents(req, res)
);

eventRouter.route("/getAllActiveEventsForOrganiser").get(
  verifyTokenMiddleware(["organizator"]),
  (req, res) => new EventController().getAllActiveEventsForOrganiser(req, res)
);

eventRouter.route("/getAllPreviousEventsForOrganiser").get(
  verifyTokenMiddleware(["organizator"]),
  (req, res) => new EventController().getAllPreviousEventsForOrganiser(req, res)
);

eventRouter.route("/newEvent").post(
  verifyTokenMiddleware(["organizator"]),
  (req, res) => new EventController().newEvent(req, res)
);

eventRouter.route("/cancelEvent").post(
  verifyTokenMiddleware(["organizator"]),
  (req, res) => new EventController().cancelEvent(req, res)
);

export default eventRouter;