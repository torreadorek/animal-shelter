import express,{Request,Response} from 'express';
import User from '../models/user';
import jwt from 'jsonwebtoken';
import { decode } from 'punycode';

class Panel {

    private router = express.Router();

    constructor() {
        this.router.post('/new',this.new);
    }

    new = async (req:Request,res:Response) => {
        try{ 
            const {token,title,description} = req.body
            const decodedToken:any =  jwt.decode(token)
            console.log('decoded',decodedToken)
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
                console.log('error',error)
                console.log('user',user)
                
                if(user) {
                    res.status(200).json('success')
                } else res.status(404).json('Cannot add new news')
            })

        } catch(error) {
            res.status(500).json('failure')
        }
    }
}

export default Panel