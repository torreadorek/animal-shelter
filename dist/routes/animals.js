"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const animals_1 = __importDefault(require("../controllers/animals"));
const router = express_1.default.Router();
router.post('/new', animals_1.default.new);
router.post('/category', animals_1.default.category);
exports.default = router;
