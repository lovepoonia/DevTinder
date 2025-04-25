const express = require("express");
const userAuth = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();

const GIVE_USER_DATA = ["firstName", "lastName", "age", "gender", "skills", "about", "photoUrl", "experience"]
userRouter.get("/user/requests/received" , userAuth , async (req,res) =>{
    try {
        const loginUser = req.user;
    
        const connectionRequest = await ConnectionRequest.find({
            toUserId : loginUser._id,
            status: "interested"
        }).populate("fromUserId",GIVE_USER_DATA);
    
        if(connectionRequest.length === 0){
            return res.json({
                success:false,
                message: "No more request received"
            })
        }
    
        res.json({
            success:true,
            data: connectionRequest,
            message:"all received request"
        })
    } catch (error) {
        res.send(error.message);
    }

})

userRouter.get("/user/connections" , userAuth, async (req, res) =>{
    try {
        const loginUser = req.user;
    
        const connectionRequest = await ConnectionRequest.find({
            $or:[
                {toUserId: loginUser._id, status: "accepted"},
                {fromUserId: loginUser._id, status: "accepted"},
            ]
        }).populate("fromUserId", ["firstName", "lastName", "age", "gender", "skills", "about", "photoUrl", "experience" , "linkedinUrl", "githubUrl"]).populate("toUserId" , ["firstName", "lastName", "age", "gender", "skills", "about", "photoUrl", "experience", "linkedinUrl", "githubUrl"]);
    
        const data = connectionRequest.map((row) => {
            if(row.fromUserId._id.toString() === loginUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId
        });
    
        res.json({
            data
        })
    } catch (error) {
        res.send(error.message)
    }
})

module.exports = userRouter;