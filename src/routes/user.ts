import express,{Application,Request,Response} from 'express';
import  UserModel from '../models/user';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';


class User {

    private router = express.Router();

    constructor(){
        this.router.post('/donates/new',this.newDonate);
    }

     newDonate =  async (req:Request,res:Response) => {
         try{
             const {token} = req.body
             const amount:string = req.body.amount;
             const decodedToken:any = jwt.decode(token);
             console.log('new donate')
             const user = await UserModel.findOne({
                     authId:decodedToken.token
                 })
                 if(user) {
                     const balance:Number= parseInt(user!.balance.toString()) + parseInt(amount);
                     console.log('balance: ',balance)
                     await UserModel.updateOne({
                        authId:decodedToken.token
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