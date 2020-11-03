import express,{Request,Response} from 'express';
import User from '../models/user';
import jwt from 'jsonwebtoken';
import {GoogleSpreadsheet} from 'google-spreadsheet';


class Panel {

    private router = express.Router();

    constructor() {
        this.router.post('/new',this.new);
        this.router.get('/spreadsheets',this.spreadsheets);
    }

    new = async (req:Request,res:Response) => {
        try{ 
            const {token,title,description} = req.body
            const decodedToken:any =  jwt.decode(token)
            await User.findOneAndUpdate({
                isAdmin:true,
                authId:decodedToken.token
            },{
                
                    $push:{
                        news:{
                        title:title,
                        description:description
                        }
                    }
                
            },(error,user)=>{
                if(user) {
                    res.status(200).json('success')
                } else res.status(404).json('Cannot add new news')
            })

        } catch(error) {
            res.status(500).json('failure')
        }
    }

    spreadsheets =  async (req:Request,res:Response) => {
        try{
            const doc = new GoogleSpreadsheet('1yYcOlYBVddqwnGjQ0hgpMREJM7QxyDkeMy_0K5i9V_Q');
    
           await doc.useServiceAccountAuth(require('../../credentials.json'));
    
           await doc.loadInfo();
           const sheet = doc.sheetsByIndex[0];
           console.log('sheet: ',sheet);
           console.log('title:',sheet.title);
           console.log('rowCont: ',sheet.rowCount);
            res.status(200).json('success');
        }catch(error) {
            console.log('error',error)
            res.status(500).json('failure')
        }
    }
}

export default Panel