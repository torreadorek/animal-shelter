require('dotenv').config({path:'./src/config/.env'})
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth2').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const User = require('../models/user')

console.log('googleID: ',process.env.HOST)
passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:`http://${process.env.HOST}:5000/auth/google/callback`,
    passReqToCallback:true
},  async (req,accessToken,refreshToken,profile,done)=>{
    console.log('henlo')
    await User.findOneAndUpdate({
        serviceId:profile.id
    },{
      serviceId:profile.id  
    },{
        upsert:true,
        new:true,
        setDefaultsOnInsert:true
    },(error,user)=>{
        return done(error,user)
    })
}))

passport.use( new FacebookStrategy({
    clientID:process.env.FACEBOOK_CLIENT_ID,
    clientSecret:process.env.FACEBOOK_APP_SECRET,
    callbackURL:`http://${process.env.HOST}:5000/auth/facebook/callback`,
    profileFields: ['id', 'email']
},async (req,accessToken,refreshToken,profile,done)=>{
    await User.findOneAndUpdate({
       serviceId:profile.id
    },{
      serviceId:profile.id  
    },{
        upsert:true,
        new:true,
        setDefaultsOnInsert:true
    },(error,user)=>{
        return done(error,user)
    })
}))
