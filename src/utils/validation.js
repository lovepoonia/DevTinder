const validator = require("validator");

const validateSingUpData = (req) => {
    const {firstName ,  email, password, gender} = req.body;

    if(!firstName ){
        throw new Error("Name is not valid");
    } else if(!validator.isEmail(email)){
        throw new Error("Email is not valid");
    } else if(!validator.isStrongPassword(password)){
        throw new Error("Take a Strong password use uppercase, lowercase, number, and special character")
    } else if(!gender){
        throw new Error("Gender is not valid");
    }
}

module.exports = validateSingUpData;