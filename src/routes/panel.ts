import express,{Request,Response} from 'express';
import User from '../models/user';
import News  from '../models/news';
import jwt from 'jsonwebtoken';


class Panel {

    private router = express.Router();

    constructor() {
        this.router.post('/news/new',this.newNews);
        this.router.get('/news/overview',this.getNews);
        this.router.post('/survey/new',this.newSurvey);
        this.router.get('/survey/overview',this.getSurvey);
    }

    newNews = async (req:Request,res:Response) => {
        try{ 
            const {token,title,description} = req.body
            const decodedToken:any =  jwt.decode(token)
            await News.create({
                title:title,
                description:description
            },(error,user)=>{
                if(user) {
                    res.status(200).json('success')
                } else res.status(403).json('Cannot add new news')
            })

        } catch(error) {
            res.status(500).json('Something went wrong')
        }
    }

    getNews = async (req:Request,res:Response) => {
        try {
            await News.find()
            .limit(5)
            .sort([['date',-1]])
            .then(news=>{
                if(news) { 
                    console.log(news)
                    res.status(200).json({message:'success',news:news})
                }
            })

        } catch(error) {
            console.log("eror",error)
            res.status(500).json('failure')
        }
    }

    newSurvey =  async (req:Request,res:Response) => {
        try{
            const {token,answers} = req.body
            const decodedToken:any =  jwt.decode(token)
            await User.findOneAndUpdate({
                authId:decodedToken.token
            },{
                    $push:{
                        survey:{
                            answers
                        }
                    }
                
            },(error,user)=>{
                if(user) {
                    res.status(200).json('success')
                } else res.status(403).json('Cannot add new news')
            })
        }catch(error) {
            console.log('error',error)
            res.status(500).json('Something went wrong')
        }
    }

    getSurvey = async (req:Request,res:Response) => {
        try{
            const {token,answers} = req.body
            const decodedToken:any =  jwt.decode(token)
            await User.findOne({authId:decodedToken.token})
            .select('survey')
            .then(surveys=>{
                if(surveys) {
                    res.status(200).json(surveys)
                } else res.status(403).json('failure')
            })
        }catch(error) {
            console.log('error',error)
            res.status(500).json('Something went wrong')
        }
    }
}

export default Panel
