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
const news_1 = __importDefault(require("../models/news"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class Panel {
    constructor() {
        this.router = express_1.default.Router();
        this.newNews = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { token, title, description } = req.body;
                const decodedToken = jsonwebtoken_1.default.decode(token);
                yield news_1.default.create({
                    title: title,
                    description: description
                }, (error, user) => {
                    if (user) {
                        res.status(200).json('success');
                    }
                    else
                        res.status(403).json('Cannot add new news');
                });
            }
            catch (error) {
                res.status(500).json('Something went wrong');
            }
        });
        this.getNews = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield news_1.default.find()
                    .limit(5)
                    .sort([['date', -1]])
                    .then(news => {
                    if (news) {
                        console.log(news);
                        res.status(200).json({ message: 'success', news: news });
                    }
                });
            }
            catch (error) {
                console.log("eror", error);
                res.status(500).json('Something went wrong');
            }
        });
        this.newSurvey = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { token, answers } = req.body;
                const decodedToken = jsonwebtoken_1.default.decode(token);
                const user = yield user_1.default.updateOne({
                    authId: decodedToken.token
                }, {
                    $push: {
                        survey: {
                            answers
                        }
                    }
                });
                if (user) {
                    res.status(200).json('success');
                }
                else
                    res.status(403).json('Cannot add new news');
            }
            catch (error) {
                console.log('error', error);
                res.status(500).json('Something went wrong');
            }
        });
        this.getSurveys = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.headers);
                const { token } = req.body;
                const decodedToken = jsonwebtoken_1.default.decode(token);
                const user = yield user_1.default.findOne({ authId: decodedToken.token })
                    .then((user) => __awaiter(this, void 0, void 0, function* () {
                    if (user) {
                        yield user_1.default.find()
                            .select(['survey', 'name'])
                            .then(surveys => {
                            if (surveys) {
                                res.status(200).json(surveys);
                            }
                            else
                                res.status(403).json('failure');
                        });
                    }
                    else
                        res.status(403).json('failure');
                }));
            }
            catch (error) {
                console.log('error', error);
                res.status(500).json('Something went wrong');
            }
        });
        this.newWalk = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { token, startTime, endTime, animal_id, date } = req.body;
                const decodedToken = jsonwebtoken_1.default.decode(token);
                yield user_1.default.updateOne({
                    authId: decodedToken.token
                }, {
                    $push: {
                        walks: {
                            animal_id: animal_id,
                            date: date,
                            startTime: startTime,
                            endTime: endTime
                        }
                    }
                })
                    .then(user => {
                    if (user) {
                        res.status(200).json('success');
                    }
                    else
                        res.status(403).json('failure');
                });
            }
            catch (error) {
                console.log('error:', error);
                res.status(500).json('Something went wrong');
            }
        });
        this.router.post('/news/new', this.newNews);
        this.router.get('/news/overview', this.getNews);
        this.router.post('/survey/new', this.newSurvey);
        this.router.put('/survey/overview', this.getSurveys);
        this.router.post('/walk/new', this.newWalk);
    }
}
exports.default = Panel;
