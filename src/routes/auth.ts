import express,{Application, Request,Response, Router} from 'express';
import {LoginTicket, OAuth2Client, TokenPayload} from 'google-auth-library';
import  User from '../models/user';
import * as jwt from 'jsonwebtoken';
import axios from 'axios';


class Auth  {

    private router = express.Router();

    constructor(){
        this.router.post('/google',this.google);
        this.router.post('/facebook',this.facebook);
        this.router.post('/check',this.check);
    }

    google = async (req:Request,res:Response) =>{
        try{
            const {token} = req.body;   
            const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
            const user = await  client.verifyIdToken({idToken:token,audience:process.env.GOOGLE_CLIENT_ID});
            const payload= user.getPayload();  

             if (user) {
                await User.findOneAndUpdate({
                    serviceId:payload!.sub
                },{
                    serviceId:payload!.sub,
                    name:payload!.name
                },{
                    upsert:true,
                    new:true,
                    setDefaultsOnInsert:true
                },(error,user)=>{
                   console.log('user',user)
                    if(error) {
                        console.log('error while adding user',error);
                        res.status(403).json('failure');
                    } 
                    if(user) {
                        console.log('added user',user)
                        const TOKEN_SECRET_KEY = <string>process.env.TOKEN_SECRET_KEY;
                        let token =  jwt.sign({token:user.authId},TOKEN_SECRET_KEY);
                        res.cookie('token',token,{httpOnly:true});
                        res.status(200).json({token:token,name:user.name});
                        res.end();
                    }
                })
            } 
        }catch(error) {
            console.log('error',error)
            res.status(500).json('Something went wrong')
        }
    }   

    facebook = async (req:Request,res:Response) =>{
        try{
            const {token} = req.body
              await axios.get(`https://graph.facebook.com/me?access_token=${token}&fields=id,name,email`)
              .then( async (userInfo:any)=>{
                  await User.findOneAndUpdate({
                      serviceId:userInfo.id
                  },{
                      serviceId:userInfo.id
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
                          res.status(200).json({email:userInfo.email,name:userInfo.name,picture:userInfo.picture});
                          res.end()
                      }
                  })
              })
          }catch(error){
              console.log('error',error)
              res.status(500).json('Something went wrong')
          }
      }

        check = async (req:Request,res:Response) => {
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
                res.status(500).json('Something went wrong')
            }
        }



}

   
export default Auth

