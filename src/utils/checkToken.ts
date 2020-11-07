import * as jwt from 'jsonwebtoken';
require('dotenv').config({path:__dirname+`/config/.env`});

export default  (body:string,cookies:string) =>{
    const token = body || cookies
    console.log('body:',body)
    console.log('cookies: ',cookies)
    console.log('process',process.env.TOKEN_SECRET_KEY)
    return  jwt.decode(token)
}