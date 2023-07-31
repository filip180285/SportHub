"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
let Sport = new Schema({
    id: {
        type: Number
    },
    name: {
        type: String
    },
    picture: {
        type: String
    },
}, {
    versionKey: false,
    _id: false
});
exports.default = mongoose_1.default.model('Sport', Sport, 'sports');
//# sourceMappingURL=sport.js.map