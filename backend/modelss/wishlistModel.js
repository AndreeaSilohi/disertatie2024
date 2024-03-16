import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    wishlistItems: [
      {
        slug: { type: String, required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
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

const WishlistItem = mongoose.model("WishlistItem", wishlistSchema);

export default WishlistItem;
