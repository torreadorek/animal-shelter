import express, { Router,Request,Response } from 'express';
import Animal from '../models/animal';
import User from '../models/user';
import multer from 'multer'; 
import * as jwt from 'jsonwebtoken';
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
    private  upload = multer({storage:this.storage});

    constructor() {
        this.router.get('/overview',this.overview);     
        this.router.post('/new',this.upload.single('photo'),this.new);
        this.router.post('/upload/image',this.image)
    }

        overview = async (req:Request,res:Response) => {
            try{
                await Animal.find({}).then(animals=>{
                    if(animals) {
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
                const {name,category,age,description,token} = req.body
                 const decodedToken:any =  jwt.decode(token)
                 console.log('token: ',token)
                 console.log('decoded: ',decodedToken)
                const user = await User.findOne({
                    isAdmin:true,
                    authId:decodedToken.token
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
                        } else res.status(404).json('Cannot add new animal')
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
}

export default Animals