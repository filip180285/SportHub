import express from 'express';
import { SportController } from '../controllers/sport.controller';
import { verifyTokenMiddleware } from '../middleware/middleware';
const sportRouter = express.Router();

sportRouter.route("/getAllSports").get(
    verifyTokenMiddleware(["ucesnik", "organizator", "administrator"]),
    (req, res) => new SportController().getAllSports(req, res)
);

sportRouter.route("/getSportPicture").get(
    (req, res) => new SportController().getSportPicture(req, res)
);

export default sportRouter;