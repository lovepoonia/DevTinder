const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const cors = require("cors");

const app = express();
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',  // 👈 allow only your frontend
    credentials: true                 // 👈 allow cookies, sessions, etc.
  }));
  

require("dotenv").config();
app.use(express.json());

app.use("/auth" , authRouter);
app.use("/" , profileRouter);
app.use("/" , requestRouter);
app.use("/" , userRouter);


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
