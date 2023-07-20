"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
let Event = new Schema({
    id: {
        type: Number
    },
    idOrg: {
        type: Number
    },
    idSport: {
        type: Number
    },
    pollDeadline: {
        type: Number
    },
    dateTime: {
        type: Number
    },
    location: {
        type: String
    },
    description: {
        type: String
    },
    status: {
        type: String // status poll-a
    },
    participationFee: {
        type: Number
    },
    comments: {
        type: Array
    },
    participants: {
        type: Array
    },
});
exports.default = mongoose_1.default.model('Event', Event, 'events');
//# sourceMappingURL=event.js.map