const User = require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const userSignUp = async (req, res) => {
    try {
      const { name, email, phone, password } = req.body
      if (!name || !email || !phone || !password) {
        return res.status(400).json({ message: "All fields required" })
      }
  
      let user = await User.findOne({ email })
      if (user) return res.status(400).json({ error: "Email already in use" })
  
      const hashPwd = await bcrypt.hash(password, 10)
      const otp = generateOtp()
  
      const newUser = await User.create({
        name,
        email,
        phone,
        password: hashPwd,
        otp,
        otpExpiry: Date.now() + 5 * 60 * 1000 // 5 mins
      })
  
      await sendOtp(email, phone, otp)
  
      res.status(200).json({ message: "OTP sent to your phone & email", userId: newUser._id })
    } catch (err) {
      res.status(500).json({ message: "Signup failed" })
    }
  }
  

  const userLogin = async (req, res) => {
    try {
      const { email, password } = req.body
      const user = await User.findOne({ email })
      if (!user) return res.status(404).json({ message: "User not found" })
      if (!user.isVerified) return res.status(401).json({ message: "Account not verified" })
  
      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) return res.status(401).json({ message: "Invalid credentials" })
  
      const otp = generateOtp()
      user.otp = otp
      user.otpExpiry = Date.now() + 5 * 60 * 1000
      await user.save()
  
      await sendOtp(user.email, user.phone, otp)
  
      res.json({ message: "OTP sent to email & phone", userId: user._id })
    } catch (err) {
      res.status(500).json({ message: "Login failed" })
    }
  }
  



const getUser = async (req, res) => {
    const user = await User.findById(req.params.id)
    res.json({email:user.email})
}



const verifyOtp = async (req, res) => {
    const { userId, otp } = req.body
    const user = await User.findById(userId)
  
    if (!user) return res.status(404).json({ message: "User not found" })
    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" })
    }
  
    user.isVerified = true
    user.otp = undefined
    user.otpExpiry = undefined
    await user.save()
  
    const token = jwt.sign({ email: user.email, id: user._id }, process.env.SECRET_KEY, { expiresIn: "1h" })
    res.json({ message: "Signup successful", token, user })
  }
  

module.exports = { userLogin, userSignUp, getUser, verifyOtp }