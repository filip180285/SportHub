import express from 'express';
import { UserController } from '../controllers/user.controller';
import { verifyTokenMiddleware } from '../middleware/middleware';

const userRouter = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/users')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage });

userRouter.route("/test").post( // testiranje
  (req, res) => new UserController().test(req, res)
);

userRouter.route('/login').post(
  (req, res) => new UserController().login(req, res)
);

userRouter.route("/register").post(
  (req, res) => new UserController().register(req, res)
);

userRouter.route("/googleSignIn").post(
  (req, res) => new UserController().googleSignIn(req, res)
);

userRouter.route("/finishGoogleSignIn").post(
  (req, res) => new UserController().finishGoogleSignIn(req, res)
);

userRouter.route("/addPicture").post(upload.single("file"), (req, res) =>
  new UserController().addPicture(req, res)
);

userRouter.route('/getUser').post(
  // verifyTokenMiddleware(["ucesnik", "organizator", "administrator"]),
  (req, res) => new UserController().getUser(req, res)
);

userRouter.route("/getUserPicture").get(
  (req, res) => new UserController().getUserPicture(req, res)
);

userRouter.route("/getPictureByUsername").get(
  (req, res) => new UserController().getPictureByUsername(req, res)
);

userRouter.route("/getAllParticipants").get(
  // verifyTokenMiddleware(["administrator"]),
  (req, res) => new UserController().getAllParticipants(req, res)
);

userRouter.route("/getAllOrganisers").get(
  // verifyTokenMiddleware(["administrator"]),
  (req, res) => new UserController().getAllOrganisers(req, res)
);

userRouter.route("/getAllActiveOrganisers").get(
  // verifyTokenMiddleware(["ucesnik"]),
  (req, res) => new UserController().getAllActiveOrganisers(req, res)
);

userRouter.route("/deleteUser").post(
  // verifyTokenMiddleware(["administrator"]),
  (req, res) => new UserController().deleteUser(req, res)
);

userRouter.route('/updateUser').post(
  // verifyTokenMiddleware(["ucesnik", "organizator", "administrator"]),
  (req, res) => new UserController().updateUser(req, res)
);

userRouter.route('/subscribe').post(
  // verifyTokenMiddleware(["ucesnik"]),
  (req, res) => new UserController().subscribe(req, res)
);

userRouter.route('/unsubscribe').post(
  // verifyTokenMiddleware(["ucesnik"]),
  (req, res) => new UserController().unsubscribe(req, res)
);

export default userRouter;
