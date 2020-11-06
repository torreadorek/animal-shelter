"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const google_auth_library_1 = require("google-auth-library");
const user_1 = __importDefault(require("../models/user"));
const jwt = __importStar(require("jsonwebtoken"));
const axios_1 = __importDefault(require("axios"));
class Auth {
    constructor() {
        this.router = express_1.default.Router();
        this.google = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { token } = req.body;
                const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
                const user = yield client.verifyIdToken({ idToken: token, audience: [process.env.GOOGLE_CLIENT_ID, process.env.MOBILE_GOOGLE_CLIENT_ID] });
                const payload = user.getPayload();
                if (user) {
                    yield user_1.default.findOneAndUpdate({
                        serviceId: payload.sub
                    }, {
                        serviceId: payload.sub,
                        name: payload.name
                    }, {
                        upsert: true,
                        new: true,
                        setDefaultsOnInsert: true
                    }, (error, user) => {
                        if (error) {
                            res.status(403).json('failure');
                        }
                        if (user) {
                            console.log('added user', user);
                            const TOKEN_SECRET_KEY = process.env.TOKEN_SECRET_KEY;
                            let token = jwt.sign({ token: user.authId }, TOKEN_SECRET_KEY);
                            res.cookie('token', token, { httpOnly: true });
                            res.status(200).json({ token: token, name: user.name, isAdmin: user.isAdmin });
                            res.end();
                        }
                    });
                }
            }
            catch (error) {
                res.status(500).json('Something went wrong');
            }
        });
        this.facebook = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { token } = req.body;
                console.log('TOKEN: ', token);
                yield axios_1.default.get(`https://graph.facebook.com/me?access_token=${token}&fields=id,name,email`)
                    .then((userInfo) => __awaiter(this, void 0, void 0, function* () {
                    yield user_1.default.findOneAndUpdate({
                        serviceId: userInfo.id
                    }, {
                        serviceId: userInfo.id,
                        name: userInfo.data.name
                    }, {
                        upsert: true,
                        new: true,
                        setDefaultsOnInsert: true
                    }, (error, user) => {
                        if (error) {
                            res.status(403).json('failure');
                        }
                        if (user) {
                            const TOKEN_SECRET_KEY = process.env.TOKEN_SECRET_KEY;
                            let token = jwt.sign({ token: userInfo === null || userInfo === void 0 ? void 0 : userInfo.id }, TOKEN_SECRET_KEY);
                            res.cookie('token', token, { httpOnly: true });
                            res.status(200).json({ token: token, name: userInfo.data.name, isAdmin: user.isAdmin });
                            res.end();
                        }
                    });
                }));
            }
            catch (error) {
                res.status(500).json('Something went wrong');
            }
        });
        this.check = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { token } = req.body;
                const decodedToken = jwt.decode(token);
                yield user_1.default.findOne({
                    authId: decodedToken.token
                }).then((user) => {
                    if (user) {
                        res.status(200).json({ name: user.name, isAdmin: user.isAdmin });
                    }
                    else
                        res.status(403).json('failure');
                });
            }
            catch (error) {
                res.status(500).json('Something went wrong');
            }
        });
        this.router.post('/google', this.google);
        this.router.post('/facebook', this.facebook);
        this.router.post('/check', this.check);
    }
}
exports.default = Auth;
