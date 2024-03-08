import express from "express";
import Prod from "../modelss/productModel.js";

const productRouter = express.Router();

productRouter.get("/", async (req, res) => {
  const products = await Prod.find();
  res.send(products);
});

productRouter.get("/slug/:slug", async (req, res) => {
  const product = await Prod.findOne({ slug: req.params.slug });

  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: "Product Not Found" });
  }
});

productRouter.get("/:id", async (req, res) => {
  const product = await Prod.findById(req.params.id);

  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: "Product Not Found" });
  }
});
export default productRouter;
