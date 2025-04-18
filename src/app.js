const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.post("/signup", async (req, res) =>{
    const user = new User({
        firstName:"love",
        lastName:"poonia",
        email:"lovepoonia@gmail.com",
        password:"love123",
        age:22,
        experience:0
    })
    try {
        await user.save();
        res.send("user created");
    } catch (err) {
        res.status(500).send("not register");
    }
})

connectDB()
    .then(()=>{
        console.log("Database connected");
        app.listen(7777,()=>{
            console.log("server is running on port 7777");
        });
    })
    .catch((err)=>{
        console.log(err);
    })
