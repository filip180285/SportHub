"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const event_controller_1 = require("../controllers/event.controller");
const middleware_1 = require("../middleware/middleware");
const eventRouter = express_1.default.Router();
eventRouter.route("/getEvent").post((0, middleware_1.verifyTokenMiddleware)(["ucesnik", "organizator", "administrator"]), (req, res) => new event_controller_1.EventController().getEvent(req, res));
eventRouter.route("/getAllActiveEvents").get((0, middleware_1.verifyTokenMiddleware)(["ucesnik"]), (req, res) => new event_controller_1.EventController().getAllActiveEvents(req, res));
eventRouter.route("/getAllPreviousEventsForParticipant").post((0, middleware_1.verifyTokenMiddleware)(["ucesnik", "administrator"]), (req, res) => new event_controller_1.EventController().getAllPreviousEventsForParticipant(req, res));
eventRouter.route("/getAllActiveEventsForOrganiser").post((0, middleware_1.verifyTokenMiddleware)(["organizator"]), (req, res) => new event_controller_1.EventController().getAllActiveEventsForOrganiser(req, res));
eventRouter.route("/getAllPreviousEventsForOrganiser").post((0, middleware_1.verifyTokenMiddleware)(["organizator", "administrator"]), (req, res) => new event_controller_1.EventController().getAllPreviousEventsForOrganiser(req, res));
eventRouter.route("/getEventParticipants").post((0, middleware_1.verifyTokenMiddleware)(["organizator", "administrator"]), (req, res) => new event_controller_1.EventController().getEventParticipants(req, res));
eventRouter.route("/newEvent").post((0, middleware_1.verifyTokenMiddleware)(["organizator"]), (req, res) => new event_controller_1.EventController().newEvent(req, res));
eventRouter.route("/cancelEvent").post((0, middleware_1.verifyTokenMiddleware)(["organizator"]), (req, res) => new event_controller_1.EventController().cancelEvent(req, res));
eventRouter.route("/applyForEvent").post((0, middleware_1.verifyTokenMiddleware)(["ucesnik"]), (req, res) => new event_controller_1.EventController().applyForEvent(req, res));
eventRouter.route("/cancelApplication").post((0, middleware_1.verifyTokenMiddleware)(["ucesnik"]), (req, res) => new event_controller_1.EventController().cancelApplication(req, res));
eventRouter.route("/addComment").post((0, middleware_1.verifyTokenMiddleware)(["ucesnik", "organizator"]), (req, res) => new event_controller_1.EventController().addComment(req, res));
eventRouter.route("/findOwingEventsForParticipant").post((0, middleware_1.verifyTokenMiddleware)(["ucesnik", "administrator"]), (req, res) => new event_controller_1.EventController().findOwingEventsForParticipant(req, res));
eventRouter.route("/findOwingEventsForOrganiser").post((0, middleware_1.verifyTokenMiddleware)(["organizator"]), (req, res) => new event_controller_1.EventController().findOwingEventsForOrganiser(req, res));
eventRouter.route("/updatePayments").post((0, middleware_1.verifyTokenMiddleware)(["organizator", "administrator"]), (req, res) => new event_controller_1.EventController().updatePayments(req, res));
exports.default = eventRouter;
//# sourceMappingURL=event.router.js.map