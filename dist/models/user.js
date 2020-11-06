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
    walks: [{
            distance: Number,
            animal_id: String,
            date: {
                type: Date,
                default: new Date(Date.now())
            },
            startTime: String,
            endTime: String
        }],
    isAdmin: {
        type: Boolean,
        default: false
    },
    appointments: [{}],
    level: Number,
    survey: [{
            id: String,
            answers: {},
            date: {
                type: Date,
                default: new Date(Date.now())
            }
        }]
});
module.exports = mongoose_1.default.model('User', UserSchema);
