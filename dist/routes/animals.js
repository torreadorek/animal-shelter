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
const animal_1 = __importDefault(require("../models/animal"));
const multer_1 = __importDefault(require("multer"));
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
                const { title, category, age, description, imageUrl } = req.body;
                yield animal_1.default.create({
                    name: title,
                    category,
                    age,
                    description,
                    image: imageUrl
                }).then(animal => {
                    if (animal) {
                        res.status(200).json('inserted');
                    }
                    else
                        res.status(404).json('Cannot add new animal');
                });
            }
            catch (error) {
                console.log('error', error);
                res.status(500).json({ error: 'Something went wrong' });
            }
        });
        this.image = (req, res) => {
            res.status(200).json({ name: req.file.filename });
        };
        this.router.get('/overview', this.overview);
        this.router.post('/new', this.new);
        this.router.post('/upload/image', this.upload.single('photo'), this.image);
    }
}
exports.default = Animals;
