import getLanguageById from "../utils/getLanguageById.js";
import batchSubmit from "../utils/batchSubmit.js";
import submitToken from "../utils/submitToken.js";
import getResultOfId from "../utils/getResultOfId.js";
import problemSchema from "../models/problem.js";




const createProblem=async(req,res)=>{
    
     const {title,description,difficultyLevel,tags,constraints,visibleTestCases,hiddenTestCases,startCode,problemCreator,referenceSolution}=req.body;

     try{
        
         for(const {language,completeCode} of referenceSolution){

             const languageId=getLanguageById(language);
             
             const submissionArray=visibleTestCases.map((testcases)=>({
                source_code:completeCode,
                language_id:languageId,
                stdin:testcases.input,
                expected_output:testcases.output
             }))


             const batchedSubmission=await batchSubmit(submissionArray);
             
             //array of tokens
             const resultTokens=batchedSubmission.map((value)=>value.token);
             const testResult=await submitToken(resultTokens)

             for(const test of testResult){
                 if(test.status_id!=3){
                    const textError=getResultOfId(test.status_id);
                    return res.status(400).json({
                        msg:`Validation failed for ${language}: ${textError}`,
                        error:test.stderr || test.compile_output || test.stdout,
                    })
                 }
             }
         }
         
         const userProblem=await  problemSchema.create({
            ...req.body,
            problemCreator:req.user._id
         })

         return res.status(201).json({msg:`Problem Saved sunncessfully`});
     }
     catch(err){
        console.log(`Some error occured in createproblem ${err.message}`);
        return res.status(500).json({msg:"Some error occured in the createproblem",err});
     }
}




const updateProblem=async(req,res)=>{
      const problemId=req.params.id;
      const {title,description,difficultyLevel,tags,constraints,visibleTestCases,hiddenTestCases,startCode,problemCreator,referenceSolution}=req.body;

      try{

        if(!problemId)
            return res.status(400).json({msg:`Invalid problemId`});


         const result=await problemSchema.findById(problemId)


         if(!result)
             return res.status(400).json({msg:`problem not found`});
         

         for(const {language,completeCode} of referenceSolution){

             const languageId=getLanguageById(language);
             
             const submissionArray=visibleTestCases.map((testcases)=>({
                source_code:completeCode,
                language_id:languageId,
                stdin:testcases.input,
                expected_output:testcases.output
             }))


             const batchedSubmission=await batchSubmit(submissionArray);
             
             //array of tokens
             const resultTokens=batchedSubmission.map((value)=>value.token);
             const testResult=await submitToken(resultTokens)

             for(const test of testResult){
                 if(test.status_id!=3){
                    const textError=getResultOfId(test.status_id);
                    return res.status(400).json({
                        msg:`Validation failed for ${language}: ${textError}`,
                        error:test.stderr || test.compile_output || test.stdout,
                    })
                 }
             }
         }

         const newProblem=await problemSchema.findByIdAndUpdate(problemId,{...req.body},{runValidators:true,new:true});
         res.status(200).json({msg:`problem updated successfully`})
      }
      catch(err){
        console.error(`Some error occured in the updateApi ${err}`);
        return res.status(500).json({msg:`some error occured`});
      }
}



const deleteProblem=async(req,res)=>{
     const problemId=req.params.id;

     try{

         if(!problemId)
            return res.status(400).json({msg:`Invalid problemId`});

         const result=await problemSchema.findByIdAndDelete(problemId);

         if(!result)
              return res.status(400).json({msg:`problem not found`});

         return res.status(200).json({msg:`problem deleted successfully`});

     }
     catch(err){
        console.error(`Some error occured in the deleteProblem Api ${err}`);
        return res.status(500).json({msg:`Some error occured`});
     }
}



const fetchProblem=async(req,res)=>{
    const problemId=req.params.id;

    try{
        const getProblem=await problemSchema.findById(problemId).select("title description difficultyLevel tags constraints visibleTestCases startCode");

        if(!getProblem)
             return res.status(404).json({msg:`Problem not found`});

        return res.status(200).json(getProblem);
    }
    catch(err){
        console.error(`Some error occured in the fetchProblem Api ${err}`);
        return res.status(500).json({msg:`Some error occured`});
    }
}


const allProblems=async(req,res)=>{

    try{
        const getProblem=await problemSchema.find({}).select("title description difficultyLevel tags");

        if(getProblem.length===0)
             return res.status(404).json({msg:`Problem not found`});

        return res.status(200).json(getProblem);
    }
    catch(err){
        console.error(`Some error occured in the getProblems Api ${err}`);
        return res.status(500).json({msg:`Some error occured`});
    }   
}



const solvedProblems=async(req,res)=>{
    
}



export {createProblem,updateProblem,deleteProblem,fetchProblem,allProblems,solvedProblems};
