import express,{Application,Request,Response,NextFunction, Router} from 'express';
import dotenv from 'dotenv';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import auth from './routes/auth';
import animals from './routes/animals'
import  mongoose from 'mongoose';
import passport from 'passport';
dotenv.config({path:'./config/.env'});

const app:Application = express();
const PORT = process.env.PORT;
const MONGO_USERNAME = process.env.MONGO_USERNAME;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_DB = process.env.MONGO_DB;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize())
app.use('/auth',auth);
app.use('/animals',animals)

mongoose.connect(`mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.9sfa7.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority`,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>{
    console.log('Successfully connected to MongoDB');
    app.listen(PORT,()=>{
        console.log(`Listening on port ${PORT}`)
    }).on('error',(error:Error)=>{
        if(error) console.log(`Cannot start listening on port ${PORT}`,error)
    })
})
.catch(error=>{
    console.log('Cannot connect to MongoDB',error);
})



