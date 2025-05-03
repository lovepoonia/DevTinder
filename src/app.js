const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const http = require("http")
const cors = require("cors");
const initializeSocket = require("./utils/socket");

const app = express();
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],                 
  }));

  

require("dotenv").config();
app.use(express.json());

app.use("/auth" , authRouter);
app.use("/profile" , profileRouter);
app.use("/" , requestRouter);
app.use("/" , userRouter);
const server = http.createServer(app);
initializeSocket(server)

connectDB()
    .then(()=>{
        console.log("Database connected");
        server.listen(7777,()=>{
            console.log("server is running on port 7777");
        });
    })
    .catch((err)=>{
        console.log(err);
    })
