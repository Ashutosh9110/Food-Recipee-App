const User = require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const userSignUp = async (req, res) => {
    
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password is required" })
        }
        let user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ error: "Email already in use" })
        }
        const hashPwd = await bcrypt.hash(password, 10)
        const newUser = await User.create({
            email, password: hashPwd
        })
        let token = jwt.sign({ email, id: newUser._id }, process.env.SECRET_KEY)
        return res.status(200).json({ msg : `User with name ${email} has been created`, token, user:newUser })
    } catch (error) {
        res.status(500).json({ message: "Failed to signin the user"})
    }
}

const userLogin = async (req, res) => {
    
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password is required" })
        }
    
        let user = await User.findOne({ email })
    
        if(!user) {
            res.status(409).json({ message : "User not found"})
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
            if(!isPasswordValid) {
                return res.status(404).json({ message: "Invaild credentials"})
            }
    
            let token = jwt.sign({ email, id: user._id }, process.env.SECRET_KEY, {expiresIn: "1h"})
            return res.status(201).json({ message: "User signed in", token, user })
    } catch (error) {
        res.status(500).json({ message: "Failed to sign in the user"})
    }
}



const getUser = async (req, res) => {
    const user = await User.findById(req.params.id)
    res.json({email:user.email})
}

module.exports = { userLogin, userSignUp, getUser }