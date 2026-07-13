import razorpay from "../utils/razorpay.js";

export const createRazorpayOrder = async (req, res) => {
  try {
    console.log("KEY:", process.env.RAZORPAY_KEY_ID);
    console.log("SECRET:", process.env.RAZORPAY_KEY_SECRET);
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // Razorpay uses paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json(order);
  } catch (error) {
    console.log(error);
    console.log(error.error);
    console.log(error.response);
    console.log(error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
      error,
    });
  }
};
