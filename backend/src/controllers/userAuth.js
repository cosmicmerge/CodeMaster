import redisClient from "../config/redis.js";
import userSchmea from "../models/userModel.js"
import validate from "../utils/validator.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const jwtKey=process.env.jWT_kEY;


const register=async (req,res)=>{
    try{
        validate(req.body);
        req.body.role="user";

        const {username,emailId,password}=req.body;

        const hashedPassword=await bcrypt.hash(password,10);


        const newUser=await userSchmea.create({
            username,
            emailId,
            password:hashedPassword,
            role:"user"
        })

        const jwtData={emailId};
        const token=jwt.sign(jwtData,jwtKey,{expiresIn:"1h"})

        res.cookie("token",token,{
            httpOnly:true,
            maxAge:3600*1000
        })

        const reply={
            username:newUser.username,
            emailId:newUser.emailId,
            _id:newUser._id,
            role:newUser.role
        }

        return res.status(201).json({
            user:reply,
            msg:"User registered successfully"
        });
    }
    catch(err){
        console.error(`Some error occured in the register api`,err.message);
        return res.status(400).json({msg:`Some error occured ${err.message}`});
    }
}



const login=async(req,res)=>{
    try{
         const {emailId,password}=req.body;

         if(!emailId || !password){
            return res.status(400).json({msg:'some fields are missing'});
         }

         const user=await userSchmea.findOne({emailId});
         if(!user){
            return res.status(404).json({msg:"Invalid user"});
         }

         const match=await bcrypt.compare(password,user.password);

         if(!match){
            return res.status(400).json({msg:"Wrong credentials"});
         }

        const jwtData={emailId};
        const token=jwt.sign(jwtData,jwtKey,{expiresIn:"1h"})

        res.cookie("token",token,{
            httpOnly:true,
            maxAge:3600*1000
        })

        const reply={
            username:user.username,
            emailId:user.emailId,
            _id:user._id,
            role:user.role
        }

        return res.status(200).json({
            user:reply,
            msg:"User registered successfully"
        });
    }
    catch(err){
       console.error(`Some error occured in the login APi`,err);
       return res.status(500).json({msg:"Some error occured"});
    }
}



const logout=async(req,res)=>{
    try{
         const {token}=req.cookies;

         const payload=jwt.decode(token);

        if(payload && payload.exp){
         await redisClient.set(`token:${token}`,"Blocked");
         await redisClient.expireAt(`token:${token}`,payload.exp)
        }
         
         res.clearCookie("token",null,{expires:new Date(Date.now())});
         res.status(201).json({msg:"Logged out successfully"});
    }
    catch(err){
        console.error(`Some error occured in the logut api ${err.message}`);
        return res.status(503).json({msg:`Some error occured ${err.message}`})
    }
}



const adminRegister=async(req,res)=>{
    try{
        validate(req.body);
        req.body.role="admin";

        const {username,emailId,password}=req.body;

        const hashedPassword=await bcrypt.hash(password,10);


        const newUser=await userSchmea.create({
            username,
            emailId,
            password:hashedPassword,
            role:"admin"
        })

        const jwtData={emailId};
        const token=jwt.sign(jwtData,jwtKey,{expiresIn:"1h"})

        res.cookie("token",token,{
            httpOnly:true,
            maxAge:3600*1000
        })

         const reply = {
             username: newUser.username,
             emailId: newUser.emailId,
             _id: newUser._id,
             role: newUser.role,
           };

        return res.status(201).json(
            {
                msg:"User registered successfully",
                user:reply
            }
        );
    }
    catch(err){
        console.error(`Some error occured in the register api`,err.message);
        return res.status(400).json({msg:`Some error occured ${err.message}`});
    }
}



export {login,register,logout,adminRegister};