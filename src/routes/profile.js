const express = require("express");
const profileRouter = express.Router();
const userAuth = require("../middlewares/auth")

profileRouter.get("/profile/view", userAuth, async (req, res)=>{
    try {
       const user = req.user;
       res.send(user);
    } catch (error) {
        res.status(400).send("Error : "+error.message);
    }
});

profileRouter.patch("/profile/edit" , userAuth, async (req, res) =>{
    try {
        
    } catch (error) {
        
    }
})

module.exports = profileRouter;