import express, { Router,Request,Response } from 'express';
import Animal from '../models/animal';
import User from '../models/user';
import multer from 'multer'; 
import * as jwt from 'jsonwebtoken';
import checkToken from '../utils/checkToken';
import validation from '../utils/validation';
import schema from '../utils/schema';

class Animals { 

    private router = express.Router();
    private  storage = multer.diskStorage({
        destination: (req:Request,file:any,cb:any) => {
            cb(null,`${__dirname}/../images`);
        },
        filename: (req:Request,file:any,cb:any) => {
            cb(null,`${file.fieldname}-${Date.now()}.png`);
        }
    })
    private  upload = multer({
        storage:this.storage,
        limits:{
            fields:5,
            fileSize:150000000
        },
        fileFilter: (req,file,cb)=>{
            this.checkFileType(file,cb);
        }
    });

    constructor() {
        this.router.get('/overview',this.overview);
        this.router.use(validation.token(schema.token));     
        this.router.post('/new',this.upload.single('photo'),this.new);
        this.router.delete('/delete/:id',validation.params(schema.delete),this.delete);
        this.router.patch('/edit',validation.body(schema.edit),this.edit);
    }

        overview = async (req:Request,res:Response) => {
            try{
                await Animal.find({}).then(animals=>{
                    if(animals) {
                        console.log(animals)
                        console.log('req cookies: ',req.cookies)
                        res.status(200).json(animals)
                    } else  { 
                        res.status(404).json({message:'There is no animals'})
                    }
                })
            }catch(error){
                console.log('error',error)
                res.status(500).json({error:'Something went wrong'})
            }
        }

        new =  async (req:Request,res:Response) => {
            try{
                const {name,category,age,description} = req.body
                 const decodedToken:any =  checkToken(req.body.token,req.cookies.token)
                
                 console.log('decoded: ',decodedToken)
                const user = await User.findOne({
                    isAdmin:true,
                    authId:decodedToken.authId
                })
                if(user) {
                    await Animal.create({
                        name:name,
                        category,
                        age,
                        description,
                        image:req.file.filename
                    }).then(animal=>{
                        if(animal) {
                            res.status(200).json({message:'inserted',image:req.file.filename})
                        } else res.status(403).json('Cannot add new animal')
                    })
                } else res.status(403).json('Cannot add new animal')
               
            }catch(error){
                console.log('error',error)
                res.status(500).json({error:'Something went wrong'})
            }
        }

        image = (req:Request,res:Response)=>{
            res.status(200).json({name:req.file.filename})
        }

        checkFileType = (file:any,cb:any) => {
            const filetypes= /jpeg|jpg|png/;
            const filename =  /^[a-z0-9.-]*$/.test(file.originalname.toLowerCase())
            const filetype = filetypes.test(file.mimetype);
            if(filetype && filename ) {
                return cb(null,true);
            } else cb('Error: only images!');
        }

        delete = async (req:Request,res:Response) => {
            const {id} = req.params;
            const decodedToken:any = checkToken(req.body.token,req.cookies.token)
            console.log('id: ',id)
            console.log('decodedToken: ',decodedToken)
            try{ 
                await User.findOne({authId:decodedToken.authId})
                .then( async user=>{
                    console.log('user',user)
                    if(user) {
                        const animal = await Animal.findOneAndDelete({
                            _id:id
                        })
                        if(animal) { 
                            console.log('animal: ',animal)
                            res.status(200).json('success')
                        } 
                        else res.status(404).json('failure')
                    } else res.status(403).json('failure')
                })
            }catch(error) {
                console.log('error',error)
                res.status(500).json('Something went wrong');
            }
        }

        edit = async (req:Request,res:Response)=>{
           try{
               const {id,name,age,category,description} = req.body; 
               const decodedToken:any = checkToken(req.body.token,req.cookies.token);
               console.log('req body: ',req.body);
              const animal =  await Animal.updateOne({
                   _id:id
               },{
                   $set:{
                       name,
                       age,
                       category,
                       description
                   }
               })
               console.log('animal ',animal)
               if(animal.nModified) res.status(200).json('success')
               else res.status(403).json('failure')

           }catch(error){
               console.log('error',error)
                res.status(500).json('Something went wrong');
           }
        }
}

export default Animals