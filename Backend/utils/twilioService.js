const twilio = require("twilio");

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendOtpSms = async (phone, otp) => {
  await client.messages.create({
    body: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
    from: process.env.TWILIO_PHONE, // Twilio number
    to: phone,
  });
};

module.exports = { sendOtpSms };
