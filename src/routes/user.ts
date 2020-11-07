import express,{Application,Request,Response} from 'express';
import  UserModel from '../models/user';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import checkToken from '../utils/checkToken';

class User {

    private router = express.Router();

    constructor(){
        this.router.post('/donation/new',this.newDonate);
    }

     newDonate =  async (req:Request,res:Response) => {
         try{      
             const amount:string = req.body.amount;
             const decodedToken:any = checkToken(req.body.token,req.cookies.token)
             console.log('new donate')
             const user = await UserModel.findOne({
                     authId:decodedToken.authId
                 })
                 if(user) {
                     const balance:Number= parseInt(user!.balance.toString()) + parseInt(amount);
                     console.log('balance: ',balance)
                     await UserModel.updateOne({
                        authId:decodedToken.authId
                    },{
                        $push:{
                            donates:{
                                amount:amount
                            }
                        },
                        balance:balance
                    })
                    res.status(200).json({message:'success',balance})
                 }

         }catch(error) {
            res.status(500).json('failure')
         }
     }

}

export default User