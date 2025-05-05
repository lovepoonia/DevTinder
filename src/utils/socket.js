const socket = require("socket.io");
const Chat = require("../models/chat");




const initializeSocket = (server) =>{
    const io = socket(server, {
        cors : {
            origin: 'http://localhost:5173',
        }
    });

    io.on("connection" , (socket) => {
        socket.on("joinChat", ({firstName, userId, targetUserId}) => {
            const roomId = [userId, targetUserId].sort().join("$");
            socket.join(roomId);
            
        });
        socket.on("sendMessage", async ({firstName , lastName , userId , targetUserId , text}) => {
            const roomId = [userId, targetUserId].sort().join("$");

            try {
                let chat = await Chat.findOne({
                    participants:{$all : [userId , targetUserId],}
                })

                if(!chat){
                    chat = new Chat({
                        participants: [userId, targetUserId],
                        messages: [],
                    });
                }

                chat.message.push({
                    senderId:userId,
                    text,
                });
                await chat.save();
                io.to(roomId).emit("messageReceived" , {firstName, lastName,text});
            } catch (error) {
                console.error(error.message)
            }
        });
        socket.on("disconnect", () => {});

    })
}

module.exports = initializeSocket;