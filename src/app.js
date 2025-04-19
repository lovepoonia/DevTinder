const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.use(express.json());

// signup api
app.post("/signup", async (req, res) =>{
    const user = new User(req.body)
    try {
        await user.save();
        res.send("user created");
    } catch (err) {
        res.status(500).send("not register");
    }
})

// user api
app.get("/user" , async (req, res) =>{
    const userEmail = req.body.email;
    try{
        const user = await User.find({email:userEmail});
        if(user.length===0){
            res.status(404).send("user not found");
        } else {
            res.send(user)
        }
    } catch (err){
        res.status(500).send("server error");
    }
})

// feed api
app.get("/feed", async (req,res)=>{
    try{
        const user = await User.find({});
        res.send(user);
    } catch (err){
        res.status(500).send("server error");
    }
})

// delete api
app.delete("/user", async (req, res) =>{
    const userId = req.body.userId;
    try {
     await User.findByIdAndDelete(userId);
        res.send("user deleted");
    } catch (error) {
       res.send("somthing went wrong"); 
    }
})

// update api using id
app.patch("/user", async (req, res)=>{
    const userId = req.body.userId;
    const data = req.body;
    try {
        const user = await User.findByIdAndUpdate(userId, data);
        res.send("user updated");
    } catch (error) {
        res.send("somthing went wrong"); 
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
