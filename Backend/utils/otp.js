// const crypto = require("crypto")
// const nodemailer = require("nodemailer")
// // const twilio = require("twilio") // if SMS needed

// // Generate OTP
// const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString()

// // Send OTP via email/SMS
// const sendOtp = async (email, phone, otp) => {
//     const transporter = nodemailer.createTransport({
//         service: "Gmail",
//         auth: { user: process.env.EMAIL, pass: process.env.EMAIL_PASS }
//     })

//     await transporter.sendMail({
//         from: process.env.EMAIL,
//         to: email,
//         subject: "Your OTP Code",
//         text: `Your OTP code is ${otp}`
//     })

//     // If using Twilio
//     // const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN)
//     // await client.messages.create({
//     //   body: `Your OTP code is ${otp}`,
//     //   from: process.env.TWILIO_PHONE,
//     //   to: phone
//     // })
// }

// module.exports = { generateOtp, sendOtp }
