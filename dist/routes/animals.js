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
const animal_1 = __importDefault(require("../models/animal"));
const user_1 = __importDefault(require("../models/user"));
const multer_1 = __importDefault(require("multer"));
const jwt = __importStar(require("jsonwebtoken"));
class Animals {
    constructor() {
        this.router = express_1.default.Router();
        this.storage = multer_1.default.diskStorage({
            destination: (req, file, cb) => {
                cb(null, `${__dirname}/../images`);
            },
            filename: (req, file, cb) => {
                cb(null, `${file.fieldname}-${Date.now()}.png`);
            }
        });
        this.upload = multer_1.default({ storage: this.storage });
        this.overview = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield animal_1.default.find({}).then(animals => {
                    if (animals) {
                        console.log(animals);
                        res.status(200).json(animals);
                    }
                    else {
                        res.status(404).json({ message: 'There is no animals' });
                    }
                });
            }
            catch (error) {
                console.log('error', error);
                res.status(500).json({ error: 'Something went wrong' });
            }
        });
        this.new = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, category, age, description, token } = req.body;
                const decodedToken = jwt.decode(token);
                console.log('token: ', token);
                console.log('decoded: ', decodedToken);
                const user = yield user_1.default.findOne({
                    isAdmin: true,
                    authId: decodedToken.token
                });
                if (user) {
                    yield animal_1.default.create({
                        name: name,
                        category,
                        age,
                        description,
                        image: req.file.filename
                    }).then(animal => {
                        if (animal) {
                            res.status(200).json({ message: 'inserted', image: req.file.filename });
                        }
                        else
                            res.status(403).json('Cannot add new animal');
                    });
                }
                else
                    res.status(403).json('Cannot add new animal');
            }
            catch (error) {
                console.log('error', error);
                res.status(500).json({ error: 'Something went wrong' });
            }
        });
        this.image = (req, res) => {
            res.status(200).json({ name: req.file.filename });
        };
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { token, id } = req.body;
            const decodedToken = jwt.decode(token);
            try {
                yield user_1.default.findOne({ authId: decodedToken.token })
                    .then((user) => __awaiter(this, void 0, void 0, function* () {
                    if (user) {
                        const animal = yield animal_1.default.deleteOne({
                            _id: id
                        });
                        if (animal) {
                            res.status(200).json('success');
                        }
                        else
                            res.status(404).json('failure');
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
        this.router.get('/overview', this.overview);
        this.router.post('/new', this.upload.single('photo'), this.new);
        this.router.post('/upload/image', this.image);
        this.router.delete('/delete', this.delete);
    }
}
exports.default = Animals;
