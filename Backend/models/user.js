const mongoose=require("mongoose")

const userSchema=mongoose.Schema({
    email:{
        type:String,
        required: [true, "Email is required"],
        unique:true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
    },
    password:{
        type:String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters"]
    },
    resetToken: String,
    resetTokenExpiry: Date
},{timestamps:true})

module.exports=mongoose.model("User",userSchema)