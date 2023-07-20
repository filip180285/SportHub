"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_router_1 = __importDefault(require("./routers/user.router"));
const event_router_1 = __importDefault(require("./routers/event.router"));
const sport_router_1 = __importDefault(require("./routers/sport.router"));
// podizanje express aplikacije
const app = (0, express_1.default)();
// za omogucavanje komunikacije izmedju razlicitih domena
app.use((0, cors_1.default)());
// za obradjivanje JSON objekata iz tela zahteva
app.use(body_parser_1.default.json());
// povezivanje sa MongoDB bazom gametime2023
mongoose_1.default.connect('mongodb://127.0.0.1:27017/gametime2023');
const connection = mongoose_1.default.connection;
connection.once('open', () => {
    console.log('db connection ok');
});
// obrada zahteva koriscenjem express Router-a
const router = express_1.default.Router();
app.use('/', router);
router.use('/users', user_router_1.default);
router.use('/events', event_router_1.default);
router.use('/sports', sport_router_1.default);
app.get('/', (req, res) => res.send('Hello World!'));
// pokretanje servera na portu 4000
app.listen(4000, () => console.log(`Express server running on port 4000`));
//# sourceMappingURL=server.js.map