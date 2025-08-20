const express=require("express")
const router=express.Router()
const { userLogin, userSignUp, getUser, verifyOtp } = require("../controller/user")

router.post("/signUp", userSignUp)
router.post("/login", userLogin)
router.get("/user/:id", getUser)
router.post("/verifyOtp", verifyOtp); 

module.exports=router