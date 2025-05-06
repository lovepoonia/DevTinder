const express = require("express");
const userAuth = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const { set } = require("mongoose");
const User = require("../models/user");
const userRouter = express.Router();

const GIVE_USER_DATA = ["firstName", "lastName", "age", "gender", "skills", "about", "photoUrl", "experience"]
const SHOW_USER_DATA = "firstName lastName age gender skills about photoUrl experience"
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
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
    .populate("fromUserId", ["firstName", "lastName", "age", "gender", "skills", "about", "photoUrl", "experience" , "linkedinUrl", "githubUrl"]).populate("toUserId" , ["firstName", "lastName", "age", "gender", "skills", "about", "photoUrl", "experience", "linkedinUrl", "githubUrl"]);

    

    const data = connectionRequests.map((row) => {
    
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
       
        return row.toUserId;
      }
    
      return row.fromUserId;
    });
    

    res.json({ data });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
})

userRouter.get("/user/feed", userAuth, async (req, res) => {
    try {
      const loggedInUser = req.user;
  
      const page = parseInt(req.query.page) || 1;
      let limit = parseInt(req.query.limit) || 10;
      limit = limit > 50 ? 50 : limit;
      const skip = (page - 1) * limit;
  
      const connectionRequests = await ConnectionRequest.find({
        $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
      }).select("fromUserId  toUserId");
  
      const hideUsersFromFeed = new Set();
      connectionRequests.forEach((req) => {
        hideUsersFromFeed.add(req.fromUserId.toString());
        hideUsersFromFeed.add(req.toUserId.toString());
      });
  
      const users = await User.find({
        $and: [
          { _id: { $nin: Array.from(hideUsersFromFeed) } },
          { _id: { $ne: loggedInUser._id } },
        ],
      })
        .select(SHOW_USER_DATA)
        .skip(skip)
        .limit(limit);
  
      res.json({ data: users });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
module.exports = userRouter;