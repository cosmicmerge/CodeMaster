import mongoose  from "mongoose";
import { Schema } from "mongoose";


const problemS=new  Schema({
    title:{
        type:String,
        trim:true,
        required:true
    },

    description:{
        type:String,
        required:true
    },

    difficultyLevel:{
        type:String,
        enum:["Easy","Medium","Hard"],
        required:true
    },

    tags:[
        {
        type:String,
        enum:["Array","String","Prefix","Suffix","Kadane",
            "Tree","Binary Tree","Binary Search Tree","Graphs",
            "Dynamic Programming","Sorting","Binary Search","Heap",
            "Priority Queue","Linked List","Math","Recursion","Two pointers",
            "Sliding Window","Backtracking"
        ],
        required:true
        }
    ],


    constraints:[
        {
            type:String,
            required:true
        }
    ],

    visibleTestCases:[
        {
            input:{
                type:String,
                required:true
            },

            output:{
                type:String,
                required:true
            },

            explanation:{
                type:String,
                required:true
            }
        }
    ],


    hiddenTestCases:[
        {
            input:{
                type:String,
                required:true
            },

            output:{
                type:String,
                required:true
            },
        }
    ],

    startCode:[
        {
            language:{
                type:String,
                required:true,
                enum:["javascript","python","cpp","java"]
            },

            initialCode:{
                type:String,
                required:true
            }
        }
    ],

    problemCreator:{
        type:Schema.Types.ObjectId,
        ref:"userSchema",
        required:true
    },

    referenceSolution:[
        {
            language:{
                type:String,
                required:true,
                enum:["javascript","python","cpp","java"]
            },

            completeCode:{
                type:String,
                required:true
            }
        }
    ]
},{timestamps:true});


const problemSchema=mongoose.model("problemSchema",problemS);
export default problemSchema;