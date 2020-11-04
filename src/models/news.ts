import mongoose from 'mongoose';

const NewsSchema = new mongoose.Schema({
    title:String,
    description:String,
    date:{
        type:Date,
        default:new Date(Date.now())
    }
})

export = mongoose.model('News',NewsSchema)