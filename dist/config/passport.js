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
require('dotenv').config({ path: './src/config/.env' });
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/user');
console.log('googleID: ', process.env.HOST);
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `http://${process.env.HOST}:5000/auth/google/callback`,
    passReqToCallback: true
}, (req, accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('henlo');
    yield User.findOneAndUpdate({
        serviceId: profile.id
    }, {
        serviceId: profile.id
    }, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
    }, (error, user) => {
        return done(error, user);
    });
})));
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `http://${process.env.HOST}:5000/auth/facebook/callback`,
    profileFields: ['id', 'email']
}, (req, accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    yield User.findOneAndUpdate({
        serviceId: profile.id
    }, {
        serviceId: profile.id
    }, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
    }, (error, user) => {
        return done(error, user);
    });
})));
