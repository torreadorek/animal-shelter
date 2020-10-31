"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config({ path: __dirname + `/config/.env` });
const app_1 = __importDefault(require("./app"));
const auth_1 = __importDefault(require("./routes/auth"));
const animals_1 = __importDefault(require("./routes/animals"));
const panel_1 = __importDefault(require("./routes/panel"));
const app = new app_1.default(parseInt(process.env.PORT) || 5000, {
    animals: new animals_1.default(),
    auth: new auth_1.default(),
    panel: new panel_1.default()
});
app.listen();
