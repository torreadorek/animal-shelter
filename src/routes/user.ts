import express,{Application,Request,Response} from 'express';
import  UserModel from '../models/user';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import checkToken from '../utils/checkToken';
import validation from '../utils/validation';
import schema from '../utils/schema';

class User {

    private router = express.Router();

    constructor(){
        this.router.use(validation.token(schema.token));
        this.router.post('/donation/new',validation.body(schema.newDonate),this.newDonate);
        this.router.post('/walk/new',validation.body(schema.newWalk),this.newWalk);
        this.router.put('/help/overview',this.getHelp);
        this.router.post('/help/new',validation.body(schema.newHelp),this.newHelp);
        this.router.delete('/help/delete/:id',validation.params(schema.deleteHelp),this.deleteHelp);
        this.router.put('/statistics/overview',this.getStatistics);
    }

     newDonate =  async (req:Request,res:Response) => {
         try{      
             const amount:Number = req.body.amount;
             const decodedToken:any = checkToken(req.body.token,req.cookies.token)
             const user = await UserModel.findOne({
                     authId:decodedToken.authId
                 })
                 if(user) {
                     const balance:Number= parseInt(user!.balance.toString()) + parseInt(amount.toString());
                     console.log('balance: ',balance)
                     const donate = await UserModel.updateOne({
                        authId:decodedToken.authId
                    },{
                        $push:{
                            donation:{
                                amount:amount
                            }
                        },
                        balance:balance
                    })
                    if(donate.nModified===1) res.status(200).json({message:'success',balance}) 
                    else res.status(403).json('failure')
                    
                 }

         }catch(error) {
            res.status(500).json('failure')
         }
     }

     newWalk = async (req:Request,res:Response) => {
      try{
        const {steps} = req.body;
        const decodedToken:any = checkToken(req.body.token,req.cookies.token);
        const newHelp = await UserModel.updateOne({
            authId:decodedToken.authId
        },{
            $push:{
                walks:{
                    steps:steps
                }
            }
        })
        if(newHelp) res.status(200).json('success');
        else res.status(403).json('failure');
      }catch(error){
            res.status(500).json('Something went wrong');
      }
    }

     getHelp = async (req:Request,res:Response) => {
        try{ 
            const decodedToken:any = checkToken(req.body.token,req.cookies.token)
                const date = new Date(Date.now())
               const data = await UserModel.findOne({
                   authId:decodedToken.authId
               }).select('help')
                if(data) {
                     const currentDate = new Date(Date.now());
                     const filteredDates = data.help.filter(help=>help.startTime>currentDate);
                    res.status(200).json({message:'success',help:filteredDates});
                } else res.status(403).json('failure')
            
        }catch(error) {
            console.log('error:',error)
            res.status(500).json('Something went wrong');
        }
    }

    newHelp = async (req:Request,res:Response)=>{
        try{ 
            const {startTime,endTime} = req.body
            const decodedToken:any = checkToken(req.body.token,req.cookies.token)
               const user = await UserModel.findOneAndUpdate({
                    authId:decodedToken.authId
                },{
                    $push:{
                        help:{
                            startTime:startTime,
                            endTime:endTime
                        }
                    }
                })
                if(user) {
                    const userInfo:any = user;
                    res.status(200).json({message:'success'})
                } else res.status(403).json('failure')
            
        }catch(error) {
            res.status(500).json('Something went wrong');
        }

      
    }

    getStatistics = async  (req:Request,res:Response)=>{
        try{
            const decodedToken:any = checkToken(req.body.token,req.cookies.token);
            const user =await UserModel.findOne({
                authId:decodedToken.authId
            }).select(['help','walks','donation'])
            if(user){
                let balance = 0;
                let allSteps = 0;
                let points=0;
                let selectedRank='ranga4';
                let rank = [
                    {name:'ranga1',from:0,to:499},
                    {name:'ranga2',from:500,to:999},
                    {name:'ranga3',from:1000,to:2000}
                ]
                
                user.donation.map(donation=>{
                   balance = balance+<number>donation.amount;
                })
                user.walks.map(walk=>{
                    allSteps= allSteps+<number>walk.steps;
                })
                points = balance+allSteps/1000; 
                rank.map(rank=>{
                    if(points>rank.from && points<rank.to) selectedRank = rank.name
                })
                res.status(200).json({message:'success',balance:balance,steps:allSteps,rank:selectedRank,user:user});
            }
            else res.status(403).json('failure');
        }catch(error){
            res.status(500).json('Something went wrong');
        }
    }
    deleteHelp = async  (req:Request,res:Response)=>{
       try{
        const id:any = req.params.id;
        const decodedToken:any = checkToken(req.body.token,req.cookies.token);
        const user = await UserModel.findOneAndUpdate({   
            authId:decodedToken.authId,
            isAdmin:true
        },{
            $pull:{
                help:{
                    _id:id
                }
            }
        })
        if(user) {
            res.status(200).json('success');
            
        } else res.status(403).json('failure');
       } catch(error) {
            res.status(500).json('Something went wrong');
       }
    }
}

export default User