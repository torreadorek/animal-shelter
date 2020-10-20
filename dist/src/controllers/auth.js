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
const user_1 = __importDefault(require("../models/user"));
const dotenv_1 = __importDefault(require("dotenv"));
const jwt = __importStar(require("jsonwebtoken"));
const google_auth_library_1 = require("google-auth-library");
dotenv_1.default.config({ path: './src/config/.env' });
module.exports = {
    test: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield user_1.default.findOneAndUpdate({
                googleId: '123132123312'
            }, {
                googleId: '123132123312'
            }, {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true
            }, (error, user) => {
                if (error) {
                    console.log('error while adding user', error);
                    res.status(403).json('failure');
                }
                if (user) {
                    console.log('added user', user);
                    res.status(200).json('success');
                }
            });
        }
        catch (error) {
            console.log('error', error);
        }
    }),
    login: (req, res) => {
        //res.send(process.env.HOST)
        res.send(`<form method="GET" action="http://${process.env.HOST}:5000/auth/google"> <button type="submit"> Zatwierdz </button> </form>`);
    },
    login1: (req, res) => {
        //res.send(process.env.HOST)
        res.send(`<form method="GET" action="http://${process.env.HOST}:5000/auth/facebook"> <button type="submit"> Zatwierdz </button> </form>`);
    },
    google: (req, res) => {
        console.log('ehehehe');
        try {
            const { token } = req.body;
            const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
            client.verifyIdToken({ idToken: token, audience: process.env.GOOGLE_CLIENT_ID })
                .then((user) => __awaiter(void 0, void 0, void 0, function* () {
                const userInfo = user.getPayload();
                yield user_1.default.findOneAndUpdate({
                    serviceId: userInfo === null || userInfo === void 0 ? void 0 : userInfo.sub
                }, {
                    serviceId: userInfo === null || userInfo === void 0 ? void 0 : userInfo.sub
                }, {
                    upsert: true,
                    new: true,
                    setDefaultsOnInsert: true
                }, (error, user) => {
                    if (error) {
                        console.log('error while adding user', error);
                        res.status(403).json('failure');
                    }
                    if (user) {
                        console.log('added user', user);
                        const TOKEN_SECRET_KEY = process.env.TOKEN_SECRET_KEY;
                        let token = jwt.sign({ token: userInfo === null || userInfo === void 0 ? void 0 : userInfo.sub }, TOKEN_SECRET_KEY);
                        res.status(200).json({ token: token, email: userInfo === null || userInfo === void 0 ? void 0 : userInfo.email, name: userInfo === null || userInfo === void 0 ? void 0 : userInfo.name, picture: userInfo === null || userInfo === void 0 ? void 0 : userInfo.picture });
                    }
                });
            }));
        }
        catch (error) {
            console.log('error', error);
        }
    },
    successFacebookRedirect: (req, res) => {
        try {
            const TOKEN_SECRET_KEY = process.env.TOKEN_SECRET_KEY;
            const reqUser = req.user;
            const authId = reqUser.authId;
            let token = jwt.sign({ token: authId }, TOKEN_SECRET_KEY);
            res.cookie('authId', token, { httpOnly: true });
            res.redirect('http://localhost:5000/auth/login1');
            res.end();
        }
        catch (error) {
            console.log('eror', error);
            res.status(403).json('not authenticated');
        }
    }
};
