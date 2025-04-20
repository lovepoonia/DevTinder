const jwt = require("jsonwebtoken");
const User = require("../models/user")
require("dotenv").config();
const userAuth = async (req, res, next) => {
    try {
        const {token} = req.cookies;

        if(!token){
            throw new Error('You are not authenticated');
        }

        const decodeJwt = await jwt.verify(token, process.env.SECRET_KEY);

        const { _id } = decodeJwt;
        // console.log(_id);
        
        const user = await User.findById(_id);
        // console.log(user);

        if(!user){
            throw new Error('User not found. Please login again.');
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(404).send("Error : " +error.message);
    }
}

module.exports = userAuth;