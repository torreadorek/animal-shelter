"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
const AnimalSchema = new mongoose_1.default.Schema({
    name: String,
    age: Number,
    date: Date,
    description: String,
    sex: String,
    category: String,
    breed: String,
    colour: String,
    image: String,
    isAdopted: Boolean,
    owner: {
        type: [{}],
        default: ''
    }
});
module.exports = mongoose_1.default.model('Animal', AnimalSchema);
