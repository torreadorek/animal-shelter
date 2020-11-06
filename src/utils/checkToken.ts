import jwt from 'jsonwebtoken';
require('dotenv').config({path:__dirname+`/config/.env`});

export default (body:string,cookies:string) =>{
    const token = body || cookies
    return jwt.verify(token,<string>process.env.TOKEN_SECRET_KEY)
}