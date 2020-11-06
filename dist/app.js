"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
require('dotenv').config({ path: __dirname + `/config/.env` });
class App {
    constructor(port, controllers) {
        this.app = express_1.default();
        this.port = port;
        this.initializeMiddlewares();
        this.initializeMongoose();
        this.initializeRoutes(controllers);
    }
    initializeRoutes(controllers) {
        this.app.use('/animals', controllers.animals.router);
        this.app.use('/auth', controllers.auth.router);
        this.app.use('/panel', controllers.panel.router);
        this.app.use('/images', express_1.default.static(__dirname + '/images'));
    }
    initializeMiddlewares() {
        this.app.use(body_parser_1.default.urlencoded({ extended: false }));
        this.app.use(body_parser_1.default.json());
        this.app.use(cors_1.default());
    }
    initializeMongoose() {
        mongoose_1.default.connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.9sfa7.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => {
            console.log('Successfully connected to MongoDB');
        })
            .catch(error => {
            console.log('Cannot connect to MongoDB', error);
        });
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`Listening on port ${this.port}`);
        });
    }
}
exports.default = App;
