import {Request,Response,NextFunction} from 'express';


export = {
    token:(schema:any)=>{
        return async  (req:Request,res:Response,next:NextFunction)=>{
            try{
                let result;
                if(req.body.token) result =  await schema.validateAsync(req.body);
                if(req.cookies.token) result = await schema.validateAsync(req.cookies);
                console.log('result',result);
                next();
            }catch(error) {
                 console.log('error',error)
                 res.status(403).json('Validation failed');
            }
         } 
    },
    body: (schema:any) =>{
       return async  (req:Request,res:Response,next:NextFunction)=>{
           try{
               const result =  await schema.validateAsync(req.body);
               console.log('result',result);
               next();
           }catch(error) {
                console.log('error',error)
                res.status(403).json('Validation failed');
           }
        }
    },
    params: (schema:any) =>{
        return async  (req:Request,res:Response,next:NextFunction)=>{
            try{
                const result =  await schema.validateAsync(req.params);
                console.log('result',result);
                next();
            }catch(error) {
                 console.log('error',error)
                 res.status(403).json('Validation failed');
            }
         }
     } 

} 