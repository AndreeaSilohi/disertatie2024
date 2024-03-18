import mongoose from "mongoose";
const cartSchema = new mongoose.Schema(
  {
    cartItems: [
      {
        quantity: { type: Number, required: true },
        slug: { type: String, required: true },
        name: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },

        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Prod",
          required: true,
        },
      },
    ],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true, //add createdat and updatedat
  }
);

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
