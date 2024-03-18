// cartRoutes.js

import express from "express";
import Cart from "../modelss/cartModel.js";
import { isAuth } from '../utils.js';
import expressAsyncHandler from "express-async-handler";

const cartRouter = express.Router();

// Route to add item to cart
// Route to add item to cart
cartRouter.post(
    "/",
    isAuth,
    expressAsyncHandler(async (req, res) => {
      const { slug, name, quantity, image, price, productId } = req.body;
  
      try {
        let userCart = await Cart.findOne({ user: req.user._id });
  
        if (!userCart) {
          // If user doesn't have a cart, create a new one
          userCart = new Cart({
            cartItems: [],
            user: req.user._id,
          });
        }
  
        // Check if the product is already in the cart
        const existingItemIndex = userCart.cartItems.findIndex(
          (item) => item.product.toString() === productId
        );
  
        if (existingItemIndex !== -1) {
          // If the product is already in the cart, update its quantity
          userCart.cartItems[existingItemIndex].quantity += quantity;
        } else {
          // If the product is not in the cart, add it as a new item
          userCart.cartItems.push({
            slug,
            name,
            quantity,
            image,
            price,
            product: productId, // Ensure product field is assigned correctly
          });
        }
  
        // Save the updated or new cart
        const savedCart = await userCart.save();
        res.status(201).send({ message: "Cart updated", cart: savedCart });
      } catch (error) {
        console.error("Error updating cart:", error);
        res.status(500).send({ message: "Internal Server Error" });
      }
    })
  );
  
cartRouter.get(
    "/",
    isAuth,
    expressAsyncHandler(async (req, res) => {
      try {
        // Find the cart associated with the logged-in user
        const userCart = await Cart.findOne({ user: req.user._id });
  
        if (userCart) {
          // If cart exists, send the cart items
          res.status(200).send({ cartItems: userCart.cartItems });
        } else {
          // If cart doesn't exist, send an empty array
          res.status(200).send({ cartItems: [] });
        }
      } catch (error) {
        console.error("Error getting cart items:", error);
        res.status(500).send({ message: "Internal Server Error" });
      }
    })
  );

 




  
export default cartRouter;
