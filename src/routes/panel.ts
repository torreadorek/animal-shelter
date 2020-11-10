import express,{Request,Response} from 'express';
import User from '../models/user';
import News  from '../models/news';
import Animal from '../models/animal';
import jwt from 'jsonwebtoken';
import checkToken from '../utils/checkToken';
import mongoose from 'mongoose';

class Panel {

    private router = express.Router();

    constructor() {
        this.router.post('/news/new',this.newNews);
        this.router.get('/news/overview',this.getNews);
        this.router.post('/survey/new',this.newSurvey);
        this.router.put('/survey/overview',this.getSurveys);
        this.router.patch('/survey/accept',this.acceptSurvey);
        this.router.patch('/walk/new',this.newWalk);
    }

    newNews = async (req:Request,res:Response) => {
        try{ 
            const {title,description} = req.body
            const decodedToken:any =  checkToken(req.body.token,req.cookies.token)
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
            const {answers} = req.body
            const decodedToken:any =  checkToken(req.body.token,req.cookies.token)
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
            const decodedToken:any =  checkToken(req.body.token,req.cookies.token)
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
            const {startTime,endTime} = req.body
            const decodedToken:any = checkToken(req.body.token,req.cookies.token)
            console.log(`data: ${startTime} ${endTime}`)
               const user = await User.findOneAndUpdate({
                    authId:decodedToken.authId
                },{
                    $push:{
                        walks:{
                            startTime:startTime,
                            endTime:endTime
                        }
                    }
                })
                if(user) {
                    console.log('user',user)
                    const walks = await User.findOne({authId:decodedToken.authId})
                    .select('walks')
                    res.status(200).json({message:'success',walks:walks})
                } else res.status(403).json('failure')
            
        }catch(error) {
            console.log('error:',error)
            res.status(500).json('Something went wrong');
        }
    }

    acceptSurvey = async  (req:Request,res:Response) =>{
            try{
                const {id} = req.body
                const decodedToken:any = checkToken(req.body.token,req.cookies.token);
                console.log('id',id)
                console.log('decodedToken',decodedToken);
                const user = await User.updateOne(
                    {
                       "authId":decodedToken.authId,
                        "survey":{
                            "$elemMatch":{
                                "_id":id
                            }
                        }
                    },{
                        "survey.$.isAccepted":true
                    }                    
                )
                console.log('user',user)
                res.status(200).json(user)
            }catch(error) {
                console.log('eror',error)
                res.status(500).json('Something went wrong')
            }
    }
}

export default Panel

/*
  const user = await User.aggregate(
                    [
                     {
                        $project:{
                            survey:{
                                $filter:{
                                    input:"$survey",
                                    as: "survey",
                                    cond:{$eq:["$$survey._id",new mongoose.Types.ObjectId('5fa6e94ad0c64077ec309b8c')]}
                                }
                            }
                        }
                     }
                    ]                    
                )
*/