const express = require("express");
const userAuth = require("../middlewares/auth");
const Chat = require("../models/chat");

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId" , userAuth , async (req ,res) => {
    try {
        const {targetUserId} = req?.params;
        const userId = req.user._id;

        let chat = await Chat.findOne({
            participants:{$all :[userId , targetUserId]}
        }).populate({
            path: "message.senderId",
            select: "firstName lastName",
        }).populate({path: "message", select:"createdAt"})
        if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
            await chat.save();
        }
        res.json(chat);
      

    } catch (error) {
        console.error(error.message);
        
    }
})

module.exports = chatRouter;