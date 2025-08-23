const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { generateOtp, sendOtp } = require("../utils/otpService"); // Brevo
const { sendOtpSms } = require("../utils/twilioService");        // Twilio

// --- SIGNUP ---
const userSignUp = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const hashPwd = await bcrypt.hash(password, 10);

    const otp = generateOtp();

    let formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;

    await sendOtpSms(formattedPhone, otp);

    const newUser = await User.create({
      name,
      email,
      phone,
      password: hashPwd,
      otp,
      otpExpiry: Date.now() + 5 * 60 * 1000,
      isVerified: false,
    });

    await sendOtp(email, otp);

    res.status(200).json({
      message: "OTP sent to your phone & email",
      userId: newUser._id,
    });
  } catch (err) {
    console.error("Signup error:", err.message);
    console.error(err.stack);
    if (err.response) {
      console.error("Error Response:", err.response.data);
    }
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
};


// --- LOGIN ---
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    // if (!user.isVerified)
    //   return res.status(401).json({ message: "Account not verified" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid credentials" });

    const otp = generateOtp();

    let formattedPhone = user.phone.startsWith("+") ? user.phone : `+91${user.phone}`;
    await sendOtpSms(formattedPhone, otp);
    await sendOtp(user.email, otp);          // ✅ send email

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();

    res.json({ message: "OTP sent to email & phone", userId: user._id });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
};

// --- VERIFY OTP ---
const verifyOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true; 
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({ message: "Verification successful", token, user });
  } catch (err) {
    console.error("OTP verification error:", err);
    res.status(500).json({ message: "OTP verification failed" });
  }
};

// --- GET USER ---
const getUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json({ email: user.email });
};

module.exports = { userLogin, userSignUp, getUser, verifyOtp };
