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
    organiser: {
        type: String
    },
    sport: {
        type: String
    },
    pollDeadline: {
        type: Number
    },
    minParticipants: {
        type: Number
    },
    maxParticipants: {
        type: Number
    },
    dateTime: {
        type: Number
    },
    location: {
        type: String
    },
    status: {
        type: String
    },
    eventPrice: {
        type: Number
    },
    pricePerUser: {
        type: Number
    },
    comments: {
        type: Array
    },
    participants: {
        type: Array
    },
    paid: {
        type: Array
    }
});
exports.default = mongoose_1.default.model('Event', Event, 'events');
//# sourceMappingURL=event.js.map