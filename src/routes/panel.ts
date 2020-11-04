import express,{Request,Response} from 'express';
import User from '../models/user';
import News  from '../models/news';
import jwt from 'jsonwebtoken';
import {GoogleSpreadsheet} from 'google-spreadsheet';


class Panel {

    private router = express.Router();

    constructor() {
        this.router.post('/news/new',this.newNews);
        this.router.get('/news/overview',this.getNews);
        this.router.get('/survey/new',this.newSurvey);
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
            res.status(500).json('failure')
        }
    }

    getNews = async (req:Request,res:Response) => {
        try {
            await News.find()
            .limit(5)
            .sort('date')
            .then(news=>{
                if(news) { 
                    console.log(news)
                    res.status(200).json('success')
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
            res.status(500).json('failure')
        }
    }

    getSurvey = (req:Request,res:Response) => {

    }
}

export default Panel

 //     const doc = new GoogleSpreadsheet(<string>process.env.GOOGLE_API_SPREADSHEET_ID);
    
        //    await doc.useServiceAccountAuth(require('../../credentials.json'));
            
        //    await doc.loadInfo();
          
        //     const sheet = doc.sheetsByIndex[0];
        //     const data = await sheet.getRows();
        //     const editedData = data.map((row,index)=>{ return {answer1:row._rawData[1]}});
        //     console.log('data',data );
        //     console.log('editedData: ',editedData);