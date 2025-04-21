const express = require("express");
const validateSingUpData = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");
const authRouter = express.Router();
// const userAuth = require("../middlewares/auth")

authRouter.post("/signup", async (req,res)=>{
    try {
        validateSingUpData(req);
        const {firstName , lastName, email, password , gender} = req.body;
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({ message: "Email in use" });
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const user = new User({firstName, lastName,  email, password:hashPassword, gender});
        await user.save();
        res.send("User created" );
    } catch (error) {
        res.status(500).send("not register"+error.message);
    }
});

authRouter.post("/login", async (req, res)=>{
    try {
        const {email, password} = req.body;
        if(!validator.isEmail(email)){
            throw new Error("Enter valid email");
        }
        const user = await User.findOne({email});
        if(!user){
            throw new Error("Invalid Credentials");
        }
        
        const isPassword = await user.validatePassword(password);
        if(isPassword){
            const token = await user.getJWT();

            res.cookie("token", token, {expires:new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)});
            res.send("logged in");
        } else {
            throw new Error("Invalid Credentials");
        }
    } catch (error) {
        res.status(500).send("not login"+error.message);
    }
});

// first method
// authRouter.post("/logout/:userId", userAuth, async (req,res)=>{
//     const user = req.user;
//     const userId = req.params?.userId;
//     if(user._id = userId){
//     res.clearCookie("token"); 
//     res.send("logged out");
//     }
    
// })

// second method
authRouter.post("/logout", async (req, res)=>{
    res.cookie("token" , null, {expires: new Date(Date.now())})
    res.send("logged out");
})
module.exports = authRouter;
