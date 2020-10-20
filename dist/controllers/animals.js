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
const animal_1 = __importDefault(require("../models/animal"));
module.exports = {
    category: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const category = req.body.category;
            yield animal_1.default.find({
                category
            }).then(animals => {
                if (animals) {
                    res.status(200).json(animals);
                }
                else
                    res.status(404).json({ message: 'No animals in this category' });
            });
        }
        catch (error) {
            console.log('error', error);
            res.status(500).json({ error: 'Something went wrong' });
        }
    }),
    new: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const name = req.body.name;
            yield animal_1.default.create({
                name,
                category: 'dog'
            }).then(animal => {
                if (animal) {
                    res.status(200).json({ message: 'inserted' });
                }
                else
                    res.status(404).json({ message: 'No animals in this category' });
            });
        }
        catch (error) {
            console.log('error', error);
            res.status(500).json({ error: 'Something went wrong' });
        }
    })
};
