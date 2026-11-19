import jwt from "jsonwebtoken";
import userSchmea from "../models/userModel.js";
import redisClient from "../config/redis.js";

const jwtKey=process.env.jwt_key;

const adminMiddleware=async(req,res,next)=>{
    try{
         const { token }=req.cookies || {};
         if(!token)
            return res.status(401).json({msg:"Authentication token missing"});
         

         const isBlocked=await redisClient.exists(`token:${token}`);
         if(isBlocked===1)
            return res.status(401).json({msg:"Token has been revoked/expired"});
         
              
         
         const payload=jwt.verify(token,jwtKey);

         const {emailId}=payload;

         if(!emailId)
            return res.status(401).json({msg:"Invalid token payload"})
         
         
         const user=await userSchmea.findOne({emailId});

         if(!user)
            return res.status(404).json({msg:"Admin user not found"})
         
            
         if(user.role!="admin")
            return res.status(403).json({msg:"Access denied. Admin privileges required."})
         
        
         req.user=user;

         next();
    }
    catch(err){
        console.log("Some  error occured in the adminMiddleware section",err.message);
        return res.status(500).json({msg:`some error occured in the adminMiddleware ${err.message}`});
    }
}


export default adminMiddleware;