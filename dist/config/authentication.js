"use strict";
require('dotenv').config({ path: './.env' });
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const User = require('../');
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `http://${process.env.HOST}:5000/auth/google/callback`,
    passReqToCallback: true
}, (req, accessToken, refreshToken, profile, done) => {
}));
