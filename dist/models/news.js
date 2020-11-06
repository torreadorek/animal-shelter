"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
const NewsSchema = new mongoose_1.default.Schema({
    title: String,
    description: String,
    date: {
        type: Date,
        default: new Date(Date.now())
    }
});
module.exports = mongoose_1.default.model('News', NewsSchema);
