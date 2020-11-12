import mongoose from 'mongoose';
import {v4 as uuidv4} from 'uuid';
import UserDoc from '../interfaces/interfaces';

const UserSchema = new mongoose.Schema({
    serviceId:{
        type:String,
        unique:true,
        required:true
    },
    authId: {
        type:String,
        default: () =>{
            return uuidv4();
        }
    },
    name:String,
    picture:String,
    balance:{
        type:Number
    },
    donation:[{
        amount:Number,
        date:{
            type:Date,
            default:new Date(Date.now())
        }
    }],
    walks:[{
        steps:Number,
        date:{
            type:Date,
            default: new Date(Date.now())
        }
    }],
    help:[{
        startTime:Date,
        endTime:Date
    }],
    isAdmin:{
        type:Boolean,
        default:false
    },
    appointments:[{}],
    level:Number,
    survey:[{
        id:{
            type:String,
            default: () =>{
            return uuidv4();
        }
        },
        answers:{},
        date:{ 
            type:Date,
            default:new Date(Date.now())
        },
        isAccepted:{
            type:Boolean,
            default:false
        }
    }]
})

export = mongoose.model<UserDoc>('User',UserSchema)