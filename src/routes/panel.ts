import express,{Request,Response} from 'express';
import User from '../models/user';
import News  from '../models/news';
import checkToken from '../utils/checkToken';
import validation from '../utils/validation';
import schema from '../utils/schema';
import Animal from '../models/animal';

class Panel {

    private router = express.Router();

    constructor() {
        this.router.get('/news/overview',this.getNews);
        this.router.use(validation.token(schema.token));
        this.router.post('/news/new',validation.body(schema.newNews),this.newNews);
        this.router.post('/survey/new',validation.body(schema.newSurvey),this.newSurvey);
        this.router.put('/survey/overview',this.getSurveys);
        this.router.patch('/survey/accept',validation.body(schema.acceptSurvey),this.acceptSurvey);
        this.router.delete('/news/delete/:id',this.deleteNews);
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

   

    

    acceptSurvey = async  (req:Request,res:Response) =>{
            try{
                const {id} = req.body
                const decodedToken:any = checkToken(req.body.token,req.cookies.token);
                console.log('id',id)
                console.log('decodedToken',decodedToken);
                const user = await User.updateOne(
                    {
                       "authId":decodedToken.authId,
                       "isAdmin":true,
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

    deleteNews =  async (req:Request,res:Response)=>{
        const {id} = req.params;
            const decodedToken:any = checkToken(req.body.token,req.cookies.token)
            console.log('id: ',id)
            console.log('decodedToken: ',decodedToken)
            try{ 
                await User.findOne({
                    authId:decodedToken.authId,
                    isAdmin:true
                })
                .then( async user=>{
                    // console.log('user',user)
                    if(user) {
                        const news = await News.findOneAndDelete({
                            _id:id
                        })
                        if(news) { 
                            console.log('news ',news)
                            res.status(200).json('success')
                        } 
                        else res.status(404).json('No news with this id');
                    } else res.status(403).json('Cannot find User with this id')
                })
            }catch(error) {
                console.log('error',error)
                res.status(500).json('Something went wrong');
            }
    }
}

export default Panel

