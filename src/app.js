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
const chatRouter = require("./routes/chat");

const app = express();
app.use(cookieParser());
const allowedOrigins = [
    'http://localhost:5173',
    'https://devtinder-frontend-cu9l.onrender.com'
  ];
  
  app.use(cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'], 
  }));
  


  

require("dotenv").config();
app.use(express.json());

app.use("/auth" , authRouter);
app.use("/profile" , profileRouter);
app.use("/" , requestRouter);
app.use("/" , userRouter);
app.use("/" , chatRouter);


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
