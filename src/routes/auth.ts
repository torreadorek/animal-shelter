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
            const user = await  client.verifyIdToken({idToken:token,audience:[<string>process.env.GOOGLE_CLIENT_ID,<string>process.env.MOBILE_GOOGLE_CLIENT_ID]});
            console.log('user: ',user)
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
                    if(error) res.status(403).json('failure');
                    if(user) {
                        const TOKEN_SECRET_KEY = <string>process.env.TOKEN_SECRET_KEY;
                        let token =  jwt.sign({authId:user.authId},TOKEN_SECRET_KEY);
                        if(payload!.azp===process.env.GOOGLE_CLIENT_ID) {
                            res.cookie('token',token,{httpOnly:true});
                            res.status(200).json({name:user.name,isAdmin:user.isAdmin,balance:user.balance});
                        } 
                        if(payload!.azp===process.env.MOBILE_GOOGLE_CLIENT_ID)  res.status(200).json({token:token,name:user.name,isAdmin:user.isAdmin,balance:user.balance});
                        res.end();
                    }
                })
            } 
        }catch(error) {
            res.status(500).json('Something went wrong')
        }
    }   

    facebook = async (req:Request,res:Response) =>{
        try{
            const {token} = req.body
            console.log('TOKEN: ',token);
              await axios.get(`https://graph.facebook.com/me?access_token=${token}&fields=id,name,email`)
              .then( async (userInfo:any)=>{
                  await User.findOneAndUpdate({
                      serviceId:userInfo.id
                  },{
                      serviceId:userInfo.id,
                      name:userInfo.data.name
                  },{
                      upsert:true,
                      new:true,
                      setDefaultsOnInsert:true
                  },(error,user)=>{
                      if(error) {
                          res.status(403).json('failure');
                      } 
                      if(user) {
                          console.log('user: ',user);
                          console.log('userInfo',userInfo);
                          const TOKEN_SECRET_KEY = process.env.TOKEN_SECRET_KEY as string
                          let token =  jwt.sign({token:userInfo?.id},TOKEN_SECRET_KEY)
                          res.cookie('token',token,{httpOnly:true})
                          res.status(200).json({token:token,name:userInfo.data.name,isAdmin:user.isAdmin});
                          res.end()
                      }
                  })
              })
          }catch(error){
              res.status(500).json('Something went wrong')
          }
      }

        check = async (req:Request,res:Response) => {
            try{
                const {token} = req.body || req.cookies
                const decodedToken:any =  jwt.decode(token)
                console.log('token: ',token)
                await User.findOne({
                    authId:decodedToken.authId
                }).then((user:any)=>{
                    console.log('user',user)
                    if(user) {
                        res.status(200).json({name:user.name,isAdmin:user.isAdmin})
                    } 
                    else  res.status(403).json('failure')
                })
            }catch(error){
                res.status(500).json('Something went wrong')
            }
        }



}

   
export default Auth

