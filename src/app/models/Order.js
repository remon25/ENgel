import { model, models, Schema } from "mongoose";

const OrderSchema = new Schema(
  {
    name: String,
    email: String,
    phone: String,
    streetAdress: String,
    cartProducts: Object,
    paid: { type: Boolean, default: false },
    deliveryTime: String,
    subtotal: Number,
    deliveryPrice: Number,
    finalTotalPrice: Number,
    paymentMethod: {
      type: String,
      enum: ["paypal", "credit card"],
      required: true,
    },
    orderType: {
      type: String,
      enum: ["delivery"],
      required: true,
    },
    paypalOrderId: {
      type: String,
      required: function () {
        return this.paymentMethod === "paypal";
      },
      validate: {
        validator: function (value) {
          // Ensure paypalOrderId is only present when paymentMethod is "paypal"
          if (this.paymentMethod !== "paypal" && value) {
            return false;
          }
          return true;
        },
        message:
          "paypalOrderId is only allowed when paymentMethod is 'paypal'.",
      },
    },
  },
  { timestamps: true }
);

// Ensure uniqueness of `paypalOrderId` for PayPal payments
OrderSchema.index(
  { paypalOrderId: 1, paymentMethod: 1 },
  { unique: true, partialFilterExpression: { paymentMethod: "paypal" } }
);

export const Order = models?.Order || model("Order", OrderSchema);
