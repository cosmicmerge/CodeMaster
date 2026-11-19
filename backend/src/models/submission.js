import mongoose from "mongoose";
import { Schema } from "mongoose";



const submissionS=new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"userSchema",
        required:true
    },

    problemId:{
        type:Schema.Types.ObjectId,
        ref:"problemSchema",
        required:true
    },

    code:{
        type:String,
        required:true
    },

    language:{
        type:String,
        required:true,
        enum:["javascript","python","cpp","java"]
    },

    status:{
        type:String,
        required:true,
        enum:["Pending","Accepted","Wrong answer","Time limit exceeded","Compilation error","Runtime error","Internal error","Exec format error"],
        default:"Pending"
    },

    runtime:{
        type:Number,
        default:0
    },

    memory:{
        type:Number,
        default:0
    },

    errorMessage:{
        type:String,
        default:" "
    },

    testCasesPassed:{
        type:Number,
        default:0
    },

    totalTestCases:{
        type:Number,
        default:0
    }
},{timestamps:true});


const submissionSchema=mongoose.model("submissionSchema",submissionS);
export default submissionSchema;