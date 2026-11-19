import mongoose from "mongoose";
import { Schema } from "mongoose";


const uSchema=new Schema({

    username:{
         type:String,
         required:true,
         unique:true,
         trim:true,
         minLenth:3,
         maxLength:35
    },

    emailId:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        immutable:true
    },

    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },

    password:{
        type:String,
        required:true
    },
    

    problemSolved:{
        type:[{
            type:Schema.Types.ObjectId,
            ref:"problemSchema"
        }]
    }
},{timestamps:true});


const userSchmea=mongoose.model("userSchmea",uSchema);
export default userSchmea;