const validator = require("validator");

const validateSingUpData = (req) => {
    const {firstName ,  email, password, age} = req.body;

    if(!firstName ){
        throw new Error("Name is not valid");
    } else if(!validator.isEmail(email)){
        throw new Error("Email is not valid");
    } else if(!validator.isStrongPassword(password)){
        throw new Error("Take a Strong password use uppercase, lowercase, number, and special character")
    } else if(!age){
        throw new Error("Age should be larger 16");
    }
}

const validateEditProfileData = (req) =>{
    const isallowed = ["firstName", "lastName", "age","about", "skills", "gender", "experience","photoUrl","linkedinUrl", "githubUrl"];

    const isValid = Object.keys(req.body).every(field => isallowed.includes(field));

    return isValid;
}

module.exports = {validateSingUpData, validateEditProfileData};