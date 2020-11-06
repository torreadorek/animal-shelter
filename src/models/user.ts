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
    balance:{
        type:Number,
        default:0
    },
    donates:[{
        amount:mongoose.Types.Decimal128,
        date:{
            type:Date,
            default:new Date(Date.now())
        }
    }],
    walks:[{
        distance:Number,
        animal_id:String,
        date:{
            type:Date,
            default:new Date(Date.now())
        },
        startTime:String,
        endTime:String
    }],
    isAdmin:{
        type:Boolean,
        default:false
    },
    appointments:[{}],
    level:Number,
    survey:[{
        id:String,
        answers:{},
        date:{ 
            type:Date,
            default:new Date(Date.now())
        }
    }]
})

export = mongoose.model<UserDoc>('User',UserSchema)