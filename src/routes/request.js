const express= require("express");
const userAuth = require("../middlewares/auth");
const requestRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest")
const User = require("../models/user");

requestRouter.post("/request/send/:status/:userId", userAuth, async (req, res) =>{
    try {
            const fromUserId = req.user?._id
            
            const toUserId = req.params?.userId;
            const status = req.params?.status;
            if (!fromUserId) {
                return res.status(400).json({
                    message: "User not authenticated"
                });
            }

            

            const allowedStatus = ["ignored", "interested"];
            if(!allowedStatus.includes(status)){
                throw new Error("Status is invalid show interested or ignored")
            }

            const toUser = await User.findById(toUserId);
            if(!toUser){
                return res.status(404).json({
                    message:"User not found"
                })
            }

            const existingConnectionRequest = await ConnectionRequest.findOne({
                $or:[
                    {fromUserId, toUserId},
                    {fromUserId:toUserId, toUserId:fromUserId}
                ]
            });
            if(existingConnectionRequest){
                return res.json({
                    message : "Request already send or received"
                })
            }
            const connectionRequest = new ConnectionRequest({
                fromUserId,
                toUserId,
                status
            })
            const data = await connectionRequest.save();
            res.json({
                success : true,
                data:data,
                message: `${req.user.firstName} ${status} to ${toUser.firstName}`
            }) 
    } catch (error) {
        res.send("Error : "+error.message)
    }
});

requestRouter.post("/request/review/:status/:requestId" ,userAuth , async (req, res)=>{
    try {
        const loginUser = req.user;
        const {status ,requestId} = req.params;
    
        const allowedStatus = ["accepted", "rejected"];
        if(!allowedStatus.includes(status)){
            throw new Error("Status is invalid accepted or rejected")
        }
    
        const connectionRequest = await ConnectionRequest.findOne({
            _id:requestId,
            toUserId: loginUser._id,
            status: "interested"
        });
    
        if(!connectionRequest){
            return res.json({
                message: "Invalid connection request"
            })
        }
        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.json({
            success:true,
            data : data
        })
    } catch (error) {
        res.send(error.message);
    }
})

module.exports = requestRouter;