const socket = require("socket.io");
const Chat = require("../models/chat");
const connectionRequest = require("../models/connectionRequest");

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
        socket.on("sendMessage", async ({firstName , lastName , userId , targetUserId , text, createdAt}) => {

            try {
                const roomId = [userId, targetUserId].sort().join("$");

                const existingConnectionRequest = await connectionRequest.findOne({
                    $or:[
                        {fromUserId : userId, toUserId : targetUserId, status:"accepted"},
                        {fromUserId: targetUserId, toUserId:userId ,status:"accepted" }
                    ]
                });
                if(!existingConnectionRequest){
                    return socket.to(roomId).emit("error", "You are not connected to this user");
                }
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
                io.to(roomId).emit("messageReceived" , {firstName, lastName,text ,createdAt});
            } catch (error) {
                console.error(error.message)
            }
        });
        socket.on("disconnect", () => {});

    })
}

module.exports = initializeSocket;