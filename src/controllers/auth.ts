import express,{Request,Response} from 'express';
import mongoose, { MongooseDocument } from 'mongoose';
import  User from '../models/user'
import dotenv from 'dotenv'
import * as jwt from 'jsonwebtoken'
import {OAuth2Client} from 'google-auth-library'
import axios from 'axios'
dotenv.config({path:'./src/config/.env'})


export = {
    test: async (req:Request,res:Response)=>{
        try{
            await User.findOneAndUpdate({
                googleId:'123132123312'
            },{
                googleId:'123132123312'
            },{
                upsert:true,
                new:true,
                setDefaultsOnInsert:true
            },(error,user)=>{
                if(error) {
                    console.log('error while adding user',error);
                    res.status(403).json('failure');
                } 
                if(user) {
                    console.log('added user',user);
                    res.status(200).json('success');
                }
            })
        }catch(error){
            console.log('error',error)
        }
        
    },
    login:(req:Request,res:Response)=>{
        //res.send(process.env.HOST)
        res.send(`<form method="GET" action="http://${process.env.HOST}:5000/auth/google"> <button type="submit"> Zatwierdz </button> </form>`)
    },
    login1:(req:Request,res:Response)=>{
        //res.send(process.env.HOST)
        res.send(`<form method="GET" action="http://${process.env.HOST}:5000/auth/facebook"> <button type="submit"> Zatwierdz </button> </form>`)
    },
    google:  (req:Request,res:Response)=>{
        console.log('ehehehe')
        try{
            const {token} = req.body   
            const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
            client.verifyIdToken({idToken:token,audience:process.env.GOOGLE_CLIENT_ID})
            .then( async user=>{
                const userInfo = user.getPayload()
                await User.findOneAndUpdate({
                    serviceId:userInfo?.sub
                },{
                    serviceId:userInfo?.sub
                },{
                    upsert:true,
                    new:true,
                    setDefaultsOnInsert:true
                },(error,user)=>{
                    if(error) {
                        console.log('error while adding user',error);
                        res.status(403).json('failure');
                    } 
                    if(user) {
                        console.log('added user',user)
                        const TOKEN_SECRET_KEY = process.env.TOKEN_SECRET_KEY as string
                        let token =  jwt.sign({token:userInfo?.sub},TOKEN_SECRET_KEY)
                        res.status(200).json({token:token,email:userInfo?.email,name:userInfo?.name,picture:userInfo?.picture});
                    }
                })
            })
        }catch(error) {
            console.log('error',error)
        }
    },
    facebook: async (req:Request,res:Response)=>{
        try{
          const {token} = req.body
          console.log('token',token)
            await axios.get(`https://graph.facebook.com/me?access_token=${token}&fields=id,name,email`)
            .then(response=>{
                console.log('response',response)
            })
        }catch(error){
            console.log('eror',error)
            res.status(403).json('not authenticated')
        }
    }
}
