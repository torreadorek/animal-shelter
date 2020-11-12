import mongoose from 'mongoose';

export default interface UserDoc extends mongoose.Document {
    authId:string,
    name:string,
    isAdmin:boolean,
    balance:Number,
    email:String,
    picture:String,
    donation:[{
        amount:Number
    }],
    walks:[{
        steps:Number
    }],
    help:[{
        startTime:Date
    }]
}