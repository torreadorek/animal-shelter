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
    balance:Number,
    donates:[{}],
    walks:[{}],
    isAdmin:{
        type:Boolean,
        default:false
    },
    appointments:[{}],
    level:Number,
    news:[{
        title:String,
        description:String
    }]
})

export = mongoose.model<UserDoc>('User',UserSchema)