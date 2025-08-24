const express=require("express")
const router=express.Router()
const { userLogin, userSignUp, getUser, verifyOtp } = require("../controller/user")
const { createCheckoutSession, markPremium } = require("../controller/premiumUserController");


router.post("/signUp", userSignUp)
router.post("/login", userLogin)
router.get("/user/:id", getUser)
router.post("/verifyOtp", verifyOtp); 

// Premium membership routes
router.post("/create-checkout-session", createCheckoutSession);
router.post("/mark-premium", markPremium);

module.exports=router