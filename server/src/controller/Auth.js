require("dotenv").config();
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const user = require("../DB/db");

const { validateRegisterUser, validateLoginUser} = require("../model/User");

module.exports={
    createUser:asyncHandler(async (req,res)=>{
        const {error} = validateRegisterUser(req.body);
        if(error){
            return res.status(400).json({message:error.details[0].message })
        }
        const { username,password } = req.body;
        user.get(`SELECT * FROM user WHERE username =?`,[username],async (err,existingUser)=>{
            if(err){
                return res.status(500).json({message:"database error"})
            }
            if(existingUser){
                return res.status(400).json({message:"User name Alread exist "});
            }
        const hashpass = await bcrypt.hash(password,10)
        user.run(`INSERT INTO user (username,password) VALUES (?,?)`,[username,hashpass],(err)=>{
                if(err){
                    return res.status(500).json({message:err.message})
                }
                return res.status(200).json({message:"User Regestered successfully"})
            })
        })
    }),
    login:asyncHandler(async (req,res)=>{
        const {error} = validateLoginUser(req.body);
        if(error){
            return res.status(401).json({message:error.details[0].message});
        }
        const {username,password} = req.body;
        user.get(`SELECT * FROM user WHERE username =?`,[username],async (err,existingUser)=>{
            if(err){
                return res.status(500).json({message:"database error"})
            }
            if(!existingUser){
                return res.status(401).json({message:"Invalid username or password"})
            }
            const isMatch = await bcrypt.compare(password,existingUser.password);
            if(!isMatch){
                return res.status(401).json({message:"Invalid username or password"})
            }
            const token = jwt.sign({ id: existingUser.id, isAdmin: existingUser.isAdmin },process.env.JWT_SECRET,{expiresIn:"1d"});
            const user_id = existingUser.id
            res.status(200).json({message:"login success",token,user_id})})
    })
}
