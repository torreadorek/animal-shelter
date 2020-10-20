import mongoose from 'mongoose';

const AnimalSchema = new mongoose.Schema({
    name:String,
    age:Number,
    date:Date,
    description:String,
    sex:String,
    category:String,
    breed:String,
    colour:String,
    image:String,
    isAdopted:Boolean,
    owner:{
        type:[{}],
        default:''
    }
})

export = mongoose.model('Animal',AnimalSchema)