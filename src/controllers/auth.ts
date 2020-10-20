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
                    serviceId:userInfo?.sub,
                    name:userInfo?.name
                },{
                    upsert:true,
                    new:true,
                    setDefaultsOnInsert:true
                },(error,user:any)=>{
                    if(error) {
                        console.log('error while adding user',error);
                        res.status(403).json('failure');
                    } 
                    if(user) {
                        console.log('added user',user)
                        const TOKEN_SECRET_KEY = process.env.TOKEN_SECRET_KEY as string
                        let token =  jwt.sign({token:user.authId},TOKEN_SECRET_KEY)
                        res.cookie('token',token,{httpOnly:true})
                        res.status(200).json({email:userInfo?.email,name:userInfo?.name,picture:userInfo?.picture});
                        res.end()
                    }
                })
            })
        }catch(error) {
            console.log('error',error)
            res.status(500).json('Something went wrong')
        }
    },
    facebook: async (req:Request,res:Response)=>{
        try{
          const {token} = req.body
          console.log('token',token)
            await axios.get(`https://graph.facebook.com/me?access_token=${token}&fields=id,name,email`)
            .then( async userInfo=>{
                await User.findOneAndUpdate({
                    serviceId:userInfo?.id
                },{
                    serviceId:userInfo?.id
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
                        let token =  jwt.sign({token:userInfo?.id},TOKEN_SECRET_KEY)
                        res.cookie('token',token,{httpOnly:true})
                        res.status(200).json({email:userInfo?.email,name:userInfo?.name,picture:userInfo?.picture});
                        res.end()
                    }
                })
            })
        }catch(error){
            console.log('eror',error)
            res.status(500).json('Something went wrong')
        }
    },
    check: async (req:Request,res:Response)=>{
        try{
            const {token} = req.body
            const decodedToken:any =  jwt.decode(token)
            await User.findOne({
                authId:decodedToken.authId
            }).then((user:any)=>{
                if(user) {
                    res.status(200).json({name:user.name})
                } 
                else  res.status(403).json('failure')
            })
        }catch(error){

        }
    }   
}
