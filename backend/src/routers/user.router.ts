import express from 'express';
import { UserController } from '../controllers/user.controller';
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

userRouter.route("/testJWT").post( // testiranje
  (req, res) => new UserController().testJWT(req, res)
);

userRouter.route('/login').post(
  (req, res) => new UserController().login(req, res)
);

userRouter.route("/register").post(
  (req, res) => new UserController().register(req, res)
);

userRouter.route("/addPicture").post(upload.single("file"), (req, res) =>
  new UserController().addPicture(req, res)
);

export default userRouter;
