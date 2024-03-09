import express from "express";
import Product from "../modelss/productModel.js";
import { productsDataNew } from "../Products.js";
import { usersData } from "../Users.js";
import User from "../modelss/userModel.js";
const seedRouter = express.Router();

seedRouter.get("/", async (req, res) => {
  await Product.deleteMany({});
  const createdProducts = await Product.insertMany(productsDataNew);

  await User.deleteMany({});
  const createdUsers = await User.insertMany(usersData);

  res.send({ createdProducts,createdUsers }); //reset to the fronted the new created products
});

export default seedRouter;
 