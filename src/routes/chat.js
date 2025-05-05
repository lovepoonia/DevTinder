const express = require("express");
const userAuth = require("../middlewares/auth");
const Chat = require("../models/chat");

const chatRouter = express.Router();

chatRouter.get("/chat/:targetId" , userAuth , async (req ,res) => {
    try {
        const targetUserId = req?.params;
        const user = req.user;
        const userId = user._id;

        const chat = await Chat.findOne({
            participants:{$all :[userId , targetUserId]}
        }).populate({
            path: "messages.senderId",
            select: "firstName lastName",
        });
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