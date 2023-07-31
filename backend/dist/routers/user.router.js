"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const userRouter = express_1.default.Router();
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/users');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });
userRouter.route("/test").post(// testiranje
(req, res) => new user_controller_1.UserController().test(req, res));
userRouter.route('/login').post((req, res) => new user_controller_1.UserController().login(req, res));
userRouter.route("/register").post((req, res) => new user_controller_1.UserController().register(req, res));
userRouter.route("/addPicture").post(upload.single("file"), (req, res) => new user_controller_1.UserController().addPicture(req, res));
userRouter.route('/getUser').post(
// verifyTokenMiddleware(["ucesnik", "organizator", "administrator"]),
(req, res) => new user_controller_1.UserController().getUser(req, res));
userRouter.route("/getUserPicture").get((req, res) => new user_controller_1.UserController().getUserPicture(req, res));
userRouter.route("/getPictureByUsername").get((req, res) => new user_controller_1.UserController().getPictureByUsername(req, res));
userRouter.route("/getAllParticipants").get(
// verifyTokenMiddleware(["administrator"]),
(req, res) => new user_controller_1.UserController().getAllParticipants(req, res));
userRouter.route("/getAllOrganisers").get(
// verifyTokenMiddleware(["administrator"]),
(req, res) => new user_controller_1.UserController().getAllOrganisers(req, res));
userRouter.route("/getAllActiveOrganisers").get(
// verifyTokenMiddleware(["ucesnik"]),
(req, res) => new user_controller_1.UserController().getAllActiveOrganisers(req, res));
userRouter.route("/deleteUser").post(
// verifyTokenMiddleware(["administrator"]),
(req, res) => new user_controller_1.UserController().deleteUser(req, res));
userRouter.route('/updateUser').post(
// verifyTokenMiddleware(["ucesnik", "organizator", "administrator"]),
(req, res) => new user_controller_1.UserController().updateUser(req, res));
userRouter.route('/subscribe').post(
// verifyTokenMiddleware(["ucesnik"]),
(req, res) => new user_controller_1.UserController().subscribe(req, res));
userRouter.route('/unsubscribe').post(
// verifyTokenMiddleware(["ucesnik"]),
(req, res) => new user_controller_1.UserController().unsubscribe(req, res));
exports.default = userRouter;
//# sourceMappingURL=user.router.js.map