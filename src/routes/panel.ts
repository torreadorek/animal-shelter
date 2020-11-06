import express,{Request,Response} from 'express';
import User from '../models/user';
import News  from '../models/news';
import Animal from '../models/animal';
import jwt from 'jsonwebtoken';


class Panel {

    private router = express.Router();

    constructor() {
        this.router.post('/news/new',this.newNews);
        this.router.get('/news/overview',this.getNews);
        this.router.post('/survey/new',this.newSurvey);
        this.router.put('/survey/overview',this.getSurveys);
        this.router.post('/walk/new',this.newWalk);
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
            res.status(500).json('Something went wrong')
        }
    }

    newSurvey =  async (req:Request,res:Response) => {
        try{
            const {token,answers} = req.body
            const decodedToken:any =  jwt.decode(token)
          const user =  await User.updateOne({
                authId:decodedToken.authId
            },{   
                    $push:{
                        survey:{
                            answers
                        }
                    }
                
            })
            if(user) {
                res.status(200).json('success')
            } else res.status(403).json('Cannot add new news')
        }catch(error) {
            console.log('error',error)
            res.status(500).json('Something went wrong')
        }
    }

    getSurveys = async (req:Request,res:Response) => {
        try{
            console.log(req.headers)
             const {token} = req.body
            const decodedToken:any =  jwt.decode(token)
          const user = await User.findOne({authId:decodedToken.authId})
            .then( async user=>{
                if(user) {
                    await User.find()
                    .select(['survey','name'])
                    .then(surveys=>{
                        if(surveys) {
                            res.status(200).json(surveys)
                        } else res.status(403).json('failure');
                    })
                } else res.status(403).json('failure');
            })
        }catch(error) {
            console.log('error',error)
            res.status(500).json('Something went wrong')
        }
    }

    newWalk = async (req:Request,res:Response) => {
        try{ 
            const {token,startTime,endTime,date} = req.body
            const decodedToken:any = jwt.decode(token)
            const numbersOfWalks = await User.find({
              walks:{
                  date:date,
                  startTime:startTime
              }  
            })
            const numbersOfAnimals = await Animal.find()
            console.log('walks: ',numbersOfWalks)
            console.log('animals: ',numbersOfAnimals.length)

            // await User.findOneAndUpdate({
            //     authId:decodedToken.authId
            // },{
            //     $push:{
            //         walks:{
            //             date:date,
            //             startTime:startTime,
            //             endTime:endTime
            //         }
            //     }
            // })
            // .then(user=>{
            //     if(user) {
            //         res.status(200).json('success')
            //     } else res.status(403).json('failure')
            // })
        }catch(error) {
            console.log('error:',error)
            res.status(500).json('Something went wrong');
        }
    }
}

export default Panel
