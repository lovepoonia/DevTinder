
const mongoose = require("mongoose");

const connectDB = async () =>{
    await mongoose.connect("mongodb+srv://<username>:</password>@devtinder.tmurymy.mongodb.net/devTinder");
};

module.exports = connectDB;