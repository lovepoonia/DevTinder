
const mongoose = require("mongoose");

const connectDB = async () =>{
    await mongoose.connect("mongodb+srv://lovepoonia:Love%401215225@devtinder.tmurymy.mongodb.net/devTinder");
};

module.exports = connectDB; 