import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    additional: { type: String, required: true },
    price: { type: Number, required: true },
    stoc: { type: Number, required: true },
    rating: { type: Number, required: true },
    numReviews: { type: Number, required: true },
  },
  {
    timestamps: true,//add createdat and updatedat
  }
);

const Product=mongoose.model('Product',productSchema);

export default Product;