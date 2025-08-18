const Sib = require("sib-api-v3-sdk");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/user")
const bcrypt = require("bcryptjs");

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ error: "User not found" });

      const resetToken = uuidv4();
      
      const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
      console.log("FRONTEND_URL:", process.env.FRONTEND_URL);

      // Save token + expiry in DB (add resetToken & expiry fields in User schema)
      user.resetToken = resetToken;
      user.resetTokenExpiry = Date.now() + 60 * 60 * 1000; // 60 minutes
      await user.save();

      // Brevo email client
      const client = Sib.ApiClient.instance;
      const apiKey = client.authentications["api-key"];
      apiKey.apiKey = process.env.BREVO_SECRET;

      const tranEmailApi = new Sib.TransactionalEmailsApi();
      const sender = { email: "ashusingh19911082@gmail.com", name: "Food Recipe App" };
      const receivers = [{ email }];

      await tranEmailApi.sendTransacEmail({
          sender,
          to: receivers,
          subject: "Password Reset Request",
          htmlContent: `<p>Click <a href="${resetLink}">here</a> to reset your password. Link expires in 15 minutes.</p>`
      });

      res.json({ message: "Password reset link sent" });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to send reset email" });
  }
};


const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
      const user = await User.findOne({
          resetToken: token,
          resetTokenExpiry: { $gt: Date.now() }
      });

      if (!user) {
          return res.status(400).json({ error: "Invalid or expired token" });
      }

      user.password = await bcrypt.hash(password, 10);
      user.resetToken = undefined;
      user.resetTokenExpiry = undefined;
      await user.save();

      res.json({ message: "Password reset successful" });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to reset password" });
  }
};


module.exports = {
  forgotPassword,
  resetPassword
}