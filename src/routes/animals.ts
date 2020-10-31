import express, { Router,Request,Response } from 'express';
import Animal from '../models/animal';
import multer from 'multer'; 

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
        this.router.post('/new',this.new);
        this.router.post('/upload/image',this.upload.single('photo'),this.image)
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
                const {title,category,age,description,imageUrl} = req.body
                await Animal.create({
                    name:title,
                    category,
                    age,
                    description,
                    image:imageUrl
                }).then(animal=>{
                    if(animal) {
                        res.status(200).json('inserted')
                    } else res.status(404).json('Cannot add new animal')
                })
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