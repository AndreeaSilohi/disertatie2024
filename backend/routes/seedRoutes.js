import express from "express";
import Prod from "../modelss/productModel.js";
import { productsData } from "../Products.js";
import { usersData } from "../Users.js";
import User from "../modelss/userModel.js";
const seedRouter = express.Router();

seedRouter.get("/", async (req, res) => {
  await Prod.deleteMany({});
  const createdProducts = await Prod.insertMany(productsData);

  await User.deleteMany({});
  const createdUsers = await User.insertMany(usersData);

  res.send({ createdProducts,createdUsers }); //reset to the fronted the new created products
});

export default seedRouter;
 