import express,{Application,Request,Response,NextFunction, Router} from 'express';
import dotenv from 'dotenv';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import auth from './routes/auth';
dotenv.config({path:'./config/.env'});

const app:Application = express();
const PORT = process.env.PORT;

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/auth',auth)

app.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}`)
}).on('error',(error:Error)=>{
    if(error) console.log(`Cannot start listening on ${PORT}`)
})

