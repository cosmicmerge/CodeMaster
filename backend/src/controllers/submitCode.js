import problemSchema from "../models/problem.js"
import submissionSchema from "../models/submission.js"
import getLanguageById from "../utils/getLanguageById.js"
import batchSubmit from "../utils/batchSubmit.js"
import submitToken from "../utils/submitToken.js"


const userSubmission=async(req,res)=>{
   try{
       const userId=req.result._id;
       const problemId=req.params.id;

       const {code,language}=req.body;

       if(!userId || !problemId || !code || !language)
           return res.status(404).json({msg:"Some fields are missing"});

       const problem=await problemSchema.findById(problemId);
       
       const submittedResult=await submissionSchema.create({
        userId,
        problemId,
        code,
        language,
        status:"Pending",
        totalTestCases:problem.hiddenTestCases.length
       })

       const languageId=getLanguageById(language);

       const submission=problem.hiddenTestCases.map((testcase)=>({
           source_code:code,
           language_id:languageId,
           stdin:testcase.input,
           expected_output:testcase.output
       }))


       const batchedSubmission=await batchSubmit(submission);


       const resultTokens=batchedSubmission.map((value)=>value.token);
       const testResult=await submitToken(resultTokens);
       
       let testCasesPassed=0;
       let rTime=0,mConsumed=0;
       let status="Accepted",errorMessage=" ";

       for(const test of testResult){
        if(test.status_id==3){
            testCasesPassed++;
            rTime=rTime+parseFloat(test.time);
            mConsumed=Math.max(mConsumed,test.memory);
        }
        else{
            if(test.status_id==4){
                status="error";
                errorMessage=test.stderr;
            }
            else{
                status="Wrong";
                errorMessage=test.stderr;
            }
            break;
        }
       }

       submittedResult.status=status;
       submittedResult.testCasesPassed=testCasesPassed;
       submittedResult.errorMessage=errorMessage;
       submittedResult.runtime=rTime;
       submittedResult.memory=mConsumed;

       await submittedResult.save();

       if(!req.result.problemSolved.includes(problemId)){
         req.result.problemSolved.push(problemId);
         await req.result.save();
       }

       res.status(201).json({msg:"Submission successfull"});
   }
   catch(err){
       console.error(`Some error occured in the userSubmissionApi ${err}`);
       return res.status(500).json({msg:"Some error occured"});
   }
}





export {userSubmission};