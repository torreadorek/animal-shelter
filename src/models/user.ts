import mongoose from 'mongoose';
import {v4 as uuidv4} from 'uuid';

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
    }
})

export = mongoose.model('User',UserSchema)