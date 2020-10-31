"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
const uuid_1 = require("uuid");
const UserSchema = new mongoose_1.default.Schema({
    serviceId: {
        type: String,
        unique: true,
        required: true
    },
    authId: {
        type: String,
        default: () => {
            return uuid_1.v4();
        }
    },
    name: String,
    balance: Number,
    donates: [{}],
    walks: [{}],
    isAdmin: Boolean,
    appointments: [{}],
    level: Number,
    news: [{}]
});
module.exports = mongoose_1.default.model('User', UserSchema);
