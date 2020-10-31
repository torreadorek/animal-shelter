"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("../models/user"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class Panel {
    constructor() {
        this.router = express_1.default.Router();
        this.new = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { token, news } = req.body;
                const decodedToken = jsonwebtoken_1.default.decode(token);
                yield user_1.default.findOneAndUpdate({
                    authId: decodedToken.authId
                }, {
                    news: news
                }, (error, user) => {
                    if (user) {
                        res.status(200).json('success');
                    }
                    else
                        res.status(404).json('Cannot add new news');
                });
            }
            catch (error) {
                res.status(500).json('failure');
            }
        });
        this.router.post('/new', this.new);
    }
}
exports.default = Panel;
