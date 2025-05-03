const express = require("express");
const profileRouter = express.Router();
const userAuth = require("../middlewares/auth");
const {validateEditProfileData} = require("../utils/validation");
const bcrypt = require("bcrypt");


profileRouter.get("/view", userAuth, async (req, res)=>{
    try {
       const user = req.user;
       res.send(user);
    } catch (error) {
        res.status(400).send("Error : "+error.message);
    }
});

profileRouter.patch("/edit" , userAuth, async (req, res) =>{
    try {
        if(!validateEditProfileData(req)){
            throw new Error("Invalid Edit Request");
        }

        const loginUser = req.user;
        Object.keys(req.body).forEach((key) => loginUser[key]= req.body[key]);

        await loginUser.save();
        
        res.json({
            success: true,
            message :`${loginUser.firstName} your profile updated successfully`,
            data: loginUser
        });
        
    } catch (error) {
        res.status(400).send("Error" +error.message);
    }
})

profileRouter.patch("/password", userAuth, async (req, res)=>{
    try {
        const {oldPassword} = req.body;
        
        const user = req.user;
        const isMatch = await user.validatePassword(oldPassword);
        if(!isMatch){
            throw new Error("Try Again...")
        }
        const {newPassword} = req.body;
        const hashPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashPassword;
        await user.save();
        res.cookie("token" , null, {expires: new Date(Date.now())})
        res.json({
            success: true,
            message: "Password updated successfully login again..."
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message : error.message
        })
    }
})

module.exports = profileRouter;