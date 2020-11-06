import dotenv from 'dotenv';
import express,{Application} from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
require('dotenv').config({path:__dirname+`/config/.env`});

class App {

    public app:Application;
    public port:number;

    constructor(port:number,controllers:any) {
        this.app = express();
        this.port=port;
        this.initializeMiddlewares();
        this.initializeMongoose();
        this.initializeRoutes(controllers);
    }

    public initializeRoutes (controllers:any) {
        this.app.use('/animals',controllers.animals.router);
        this.app.use('/auth',controllers.auth.router);
        this.app.use('/panel',controllers.panel.router);
        this.app.use('/user',controllers.user.router);
        this.app.use('/images',express.static(__dirname+'/images'));
    }

    public initializeMiddlewares() {
        this.app.use(bodyParser.urlencoded({extended:false}));
        this.app.use(bodyParser.json());
        this.app.use(cors());
        this.app.use(cookieParser());
    }

    public initializeMongoose () {  
        mongoose.connect(`mongodb+srv://${<string>process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD }@cluster0.9sfa7.mongodb.net/${process.env.MONGO_DB }?retryWrites=true&w=majority`,{useNewUrlParser:true,useUnifiedTopology:true})
            .then(()=>{
                console.log('Successfully connected to MongoDB');
            })
            .catch(error=>{
                console.log('Cannot connect to MongoDB',error);
            })
    }

    public listen() {
        this.app.listen(this.port,()=>{
            console.log(`Listening on port ${this.port}`)
        })
    }
}

export default App;
