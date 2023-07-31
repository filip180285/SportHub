"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
let User = new Schema({
    id: {
        type: Number
    },
    name: {
        type: String
    },
    lastname: {
        type: String
    },
    username: {
        type: String
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
    type: {
        type: String
    },
    status: {
        type: String
    },
    phone: {
        type: String
    },
    picture: {
        type: String
    },
    subscriptions: {
        type: Array
    }
}, {
    versionKey: false
});
exports.default = mongoose_1.default.model('User', User, 'users');
//# sourceMappingURL=user.js.map