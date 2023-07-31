"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const event_controller_1 = require("../controllers/event.controller");
const middleware_1 = require("../middleware/middleware");
const eventRouter = express_1.default.Router();
eventRouter.route("/test").post(// testiranje
(req, res) => new event_controller_1.EventController().test(req, res));
eventRouter.route("/getEvent").post(
// verifyTokenMiddleware(["ucesnik", "organizator", "administrator"]),
(req, res) => new event_controller_1.EventController().getEvent(req, res));
eventRouter.route("/getAllActiveEvents").get(
// verifyTokenMiddleware(["ucesnik"]),
(req, res) => new event_controller_1.EventController().getAllActiveEvents(req, res));
eventRouter.route("/getAllPreviousEventsForParticipant").post(
// verifyTokenMiddleware(["ucesnik"]),
(req, res) => new event_controller_1.EventController().getAllPreviousEventsForParticipant(req, res));
eventRouter.route("/getAllActiveEventsForOrganiser").post(
// verifyTokenMiddleware(["organizator"]),
(req, res) => new event_controller_1.EventController().getAllActiveEventsForOrganiser(req, res));
eventRouter.route("/getAllPreviousEventsForOrganiser").post(
// verifyTokenMiddleware(["organizator"]),
(req, res) => new event_controller_1.EventController().getAllPreviousEventsForOrganiser(req, res));
eventRouter.route("/newEvent").post((0, middleware_1.verifyTokenMiddleware)(["organizator"]), (req, res) => new event_controller_1.EventController().newEvent(req, res));
eventRouter.route("/cancelEvent").post(
// verifyTokenMiddleware(["organizator"]),
(req, res) => new event_controller_1.EventController().cancelEvent(req, res));
eventRouter.route("/applyForEvent").post(
// verifyTokenMiddleware(["ucesnik"]),
(req, res) => new event_controller_1.EventController().applyForEvent(req, res));
eventRouter.route("/cancelApplication").post(
// verifyTokenMiddleware(["ucesnik"]),
(req, res) => new event_controller_1.EventController().cancelApplication(req, res));
eventRouter.route("/addComment").post(
// verifyTokenMiddleware(["ucesnik", "organizator"]),
(req, res) => new event_controller_1.EventController().addComment(req, res));
eventRouter.route("/findOwingEventsForParticipant").post(
// verifyTokenMiddleware(["ucesnik", "administrator"]),
(req, res) => new event_controller_1.EventController().findOwingEventsForParticipant(req, res));
eventRouter.route("/findOwingEventsForOrganiser").post(
// verifyTokenMiddleware(["organizator"]),
(req, res) => new event_controller_1.EventController().findOwingEventsForOrganiser(req, res));
eventRouter.route("/updatePayments").post(
// verifyTokenMiddleware(["organizator"]),
(req, res) => new event_controller_1.EventController().updatePayments(req, res));
exports.default = eventRouter;
//# sourceMappingURL=event.router.js.map