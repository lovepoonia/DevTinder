const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:3,
        maxLength:20
    },
    lastName:{
        type:String,
        minLength:3,
        maxLength:20
    },
    age:{
        type:Number,
        min:16
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        minLength:13,
        maxLength:50,
        // validate:{
        //     validator:function(email){
        //         return /^(.*(?:@gmail.com))$/.test(email);
        //     },
        //     message:
        //       'email must include @gmail.com'
        // }

        // using validator library
        validate (value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    password:{
        type:String,
        required:true,
        minLength:[8,"Password must be at least 8 characters"],
        // validate: {
        //     validator: function (value) {
        //       // At least one uppercase, one lowercase, one number, and one special character
        //       return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);
        //     },
        //     message:
        //       'Password must include uppercase, lowercase, number, and special character'
        //   }

        // using validator library
        validate (value){
            if(!validator.isStrongPassword(value)){ 
                throw new Error('Password must include uppercase, lowercase, number, and special character');
            }
        }
    },
    experience:{
        type:Number,
        default:0
    },
    photoUrl:{
        type:String,
        default:"https://pinnacle.works/wp-content/uploads/2022/06/dummy-image.jpg",
        validate (value){
            if(!validator.isURL(value)){
                throw new Error('Invalid URL')
            }
        }
    },
    about:{
        type:String,
        default:'I am new user'
    },
    skills:{
        type:[String],
        default:["No skill"]
    },
    gender:{
        type:String,
        enum: ['male', 'female', 'other'],
        validate(value){
            if(!["male", "female","other"].includes(value)){
                throw new Error("Invalid gender");
            }
        }
    }, 
    linkedinUrl:{
        type:String,
        default:"edit later..."
    },
    githubUrl:{
        type:String,
        default:"edit later..."
    }
},{
    timestamps:true
});

userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this;
    const hashedPassword = user.password;
    
    const isValidPassword = await bcrypt.compare(passwordInputByUser, hashedPassword);
    return isValidPassword;
}

userSchema.methods.getJWT = async function (){
    const user = this;
    const token = await jwt.sign({_id:user._id}, process.env.SECRET_KEY , { expiresIn: "7d"});
    return token;
}

module.exports= mongoose.model("User", userSchema);
