// backend/utils/otpService.js
const SibApiV3Sdk = require("sib-api-v3-sdk");

// Generate OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP via Brevo (Email)
const sendOtp = async (email, otp) => {
  let defaultClient = SibApiV3Sdk.ApiClient.instance;
  let apiKey = defaultClient.authentications["api-key"];
  apiKey.apiKey = process.env.BREVO_SECRET;

  const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

  const sender = {
    email: process.env.SENDER_EMAIL,
    name: "MyApp Security",
  };

  const receivers = [{ email }];

  await tranEmailApi.sendTransacEmail({
    sender,
    to: receivers,
    subject: "Your OTP Code",
    textContent: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
  });
};

module.exports = { generateOtp, sendOtp };
