const Stripe = require("stripe");
const User = require("../models/user");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// --- Create Checkout Session ---
const createCheckoutSession = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) return res.status(400).json({ message: "User ID required" });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Premium Membership" },
            unit_amount: 2000 * 100, // $2000 cents → $2000? OR 2000 INR → update accordingly
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/payment-success?userId=${userId}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-failed`,
    });

    res.json({ id: session.id, url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).json({ message: "Stripe checkout failed", error: err.message });
  }
};

// --- Mark user as Premium ---
const markPremium = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isPremium = true;
    await user.save();

    res.json({ message: "User upgraded to premium", user });
  } catch (err) {
    console.error("Mark premium error:", err);
    res.status(500).json({ message: "Failed to mark premium" });
  }
};


module.exports = {
  createCheckoutSession, 
  markPremium
}