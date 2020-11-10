import express,{Application,Request,Response} from 'express';
import  UserModel from '../models/user';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import checkToken from '../utils/checkToken';

class User {

    private router = express.Router();

    constructor(){
        this.router.post('/donation/new',this.newDonate);
        this.router.patch('/walk/new',this.newWalk);
        this.router.put('/walk/overview',this.getWalks);
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

     newWalk = async (req:Request,res:Response) => {
        try{ 
            const {startTime,endTime} = req.body
            const decodedToken:any = checkToken(req.body.token,req.cookies.token)
            console.log(`data: ${startTime} ${endTime}`)
               const user = await UserModel.findOneAndUpdate({
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
                    res.status(200).json({message:'success'})
                } else res.status(403).json('failure')
            
        }catch(error) {
            console.log('error:',error)
            res.status(500).json('Something went wrong');
        }
    }

     getWalks = async (req:Request,res:Response) => {
        try{ 
            const decodedToken:any = checkToken(req.body.token,req.cookies.token)
               const walks = await UserModel.findOne({
                    authId:decodedToken.authId
               }).select('walks')
                if(walks) {
                    console.log('user',walks)
                    res.status(200).json({message:'success',walks:walks})
                } else res.status(403).json('failure')
            
        }catch(error) {
            console.log('error:',error)
            res.status(500).json('Something went wrong');
        }
    }

}

export default User