"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sport_controller_1 = require("../controllers/sport.controller");
const middleware_1 = require("../middleware/middleware");
const sportRouter = express_1.default.Router();
sportRouter.route("/getAllSports").get((0, middleware_1.verifyTokenMiddleware)(["ucesnik", "organizator", "administrator"]), (req, res) => new sport_controller_1.SportController().getAllSports(req, res));
sportRouter.route("/getSportPicture").get((req, res) => new sport_controller_1.SportController().getSportPicture(req, res));
exports.default = sportRouter;
//# sourceMappingURL=sport.router.js.map