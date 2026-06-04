import mongoose from "mongoose";
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    orderItems: [
      {
        name: String,
        qty: Number,
        price: Number,
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
      },
    ],

    shippingAddress: {
      address: String,
      city: String,
      postalCode: String,
      country: String,
    },

    paymentMethod: {
      type: String,
      default: "COD",
    },

    isPaid: {
      type: Boolean,
      default: false,
    },

    paidAt: Date,

    totalPrice: Number,

    // ✅ ORDER STATUS (IMPORTANT)
    status: {
      type: String,
      enum: ["Placed", "Processing", "Shipped", "Delivered"],
      default: "Placed",
    },

    isDelivered: {
      type: Boolean,
      default: false,
    },

    deliveredAt: Date,
  },
  {
    timestamps: true,
  },
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
