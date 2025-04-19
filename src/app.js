const express = require("express");
const connectDB = require("./config/database");
const validator = require("validator");
const validateSingUpData = require("./utils/validation")
const bcrypt = require("bcrypt")
const app = express();
const User = require("./models/user");

app.use(express.json());

// signup api
app.post("/signup", async (req, res) =>{
    try {
        validateSingUpData(req);
        const {firstName , lastName, email, password , gender} = req.body;

        const hashPassword = await bcrypt.hash(password, 10);

        const user = new User({firstName , lastName, email, password: hashPassword, gender});

        await user.save();
        res.send("user created");
    } catch (err) {
        res.status(500).send("not register"+err.message);
    }
})

// login api
app.post("/login", async(req, res) =>{
    try {
        const {email , password} = req.body;
        if(!validator.isEmail(email)){
            throw new Error("Enter valid email");
        }

        const user = await User.findOne({email:email});
        if(!user){
            throw new Error("Invalid Credentials");
        }

        const isPassword = await bcrypt.compare(password , user.password);
        if(isPassword){
            res.send("login success");
        } else {
            throw new Error("Invalid Credentials");
        }
    } catch (error) {
        res.status(500).send("not login"+error.message);
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
app.patch("/user/:userId", async (req, res)=>{
    const userId = req.params?.userId;
    const data = req.body;
    try {
        const Allowed_Update = ["userId","age","photoUrl","experience","about","skills"];
        const allowedKeys = Object.keys(data).every(key => Allowed_Update.includes(key));
        if(!allowedKeys){
            throw new Error("update not allowed");
        }
        if(data?.skills.length > 10){
            throw new Error("skill limit exceeded like 10");
        }
        const isValidUrl = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$/i.test(data?.photoUrl);
        if (!isValidUrl) {
          return res.status(400).json({ error: 'Invalid photo URL' });
        }

        // using validator library
        // if(!validator.isURL(data?.photoUrl)){
        //     throw new Error("invalid photo url");
        // }
        const user = await User.findByIdAndUpdate(userId, data);
        res.send("user updated");
    } catch (error) {
        res.send("somthing went wrong"+error.message); 
    }
})

// update api using email
app.patch("/email", async (req, res)=>{
    const email =req.body.email;
    const data = req.body;
    try {
            const updatedUser = await User.findOneAndUpdate(
              { email},        // filter
              { $set: data },    // update
              { new: true }            // return the updated doc
            );
        res.send("user updated");
    } catch (error) {
        res.send(error); 
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
