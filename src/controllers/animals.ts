import express,{Request,Response} from 'express'
import Animal from '../models/animal'

export = {
    category: async (req:Request,res:Response)=>{
        try{
            const category:string = req.body.category
            await Animal.find({
                category
            }).then(animals=>{
                if(animals) {
                    res.status(200).json(animals)
                } else res.status(404).json({message:'No animals in this category'})
            })
        }catch(error){
            console.log('error',error)
            res.status(500).json({error:'Something went wrong'})
        }
    },
    new: async (req:Request,res:Response)=>{
        try{
            const name:string = req.body.name
            await Animal.create({
                name,
                category:'dog'
            }).then(animal=>{
                if(animal) {
                    res.status(200).json({message:'inserted'})
                } else res.status(404).json({message:'No animals in this category'})
            })
        }catch(error){
            console.log('error',error)
            res.status(500).json({error:'Something went wrong'})
        }
    }
}