import express from 'express';
import cors from 'cors'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import userRouter from './routers/user.router';
import eventRouter from './routers/event.router';
import sportRouter from './routers/sport.router';

require("dotenv").config();

// podizanje express aplikacije
const app = express();
// za omogućavanje komunikacije izmedju razlicitih domena
app.use(cors());
// za obradjivanje JSON objekata iz tela zahteva
app.use(bodyParser.json());

// povezivanje sa MongoDB bazom gametime2023
mongoose.connect(process.env.DATABASE_URL);
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('db connection ok')
})

// obrada zahteva koriscenjem express Router-a
const router = express.Router();
app.use('/', router);
router.use('/users', userRouter);
router.use('/events', eventRouter);
router.use('/sports', sportRouter);

app.get('/', (req, res) => res.send('Hello World!'));
// pokretanje servera na portu 4000
app.listen(4000, () => console.log(`Express server running on port 4000`));



