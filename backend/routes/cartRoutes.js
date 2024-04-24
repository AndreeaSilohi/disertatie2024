// cartRoutes.js

import express from "express";
import Cart from "../modelss/cartModel.js";
import { isAuth } from '../utils.js';
import expressAsyncHandler from "express-async-handler";

const cartRouter = express.Router();

// Route to add item to cart
cartRouter.post(
    "/",
    isAuth,
    expressAsyncHandler(async (req, res) => {
      const { slug, name, quantity, image, price, productId,stoc } = req.body;
  
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
            product: productId,
            stoc,
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

  cartRouter.put(
    "/:productId",
    isAuth,
    expressAsyncHandler(async (req, res) => {
      const productId = req.params.productId;
      const { quantity } = req.body;
  
      try {
        const userCart = await Cart.findOne({ user: req.user._id });
  
        if (!userCart) {
          return res.status(404).send({ message: "Cart not found" });
        }
  
        const existingItem = userCart.cartItems.find(
          (item) => item.product.toString() === productId
        );
  
        if (!existingItem) {
          return res.status(404).send({ message: "Item not found in cart" });
        }
  
        existingItem.quantity = quantity;
  
        const savedCart = await userCart.save();
        res.status(200).send({ message: "Cart updated", cart: savedCart });
      } catch (error) {
        console.error("Error updating cart:", error);
        res.status(500).send({ message: "Internal Server Error" });
      }
    })
  );

 
  cartRouter.delete(
    "/:productId",
    isAuth,
    expressAsyncHandler(async (req, res) => {
      const productId = req.params.productId;
  
      try {
        const userCart = await Cart.findOne({ user: req.user._id });
  
        if (!userCart) {
          return res.status(404).send({ message: "Cart not found" });
        }
  
        // Find the index of the item to be deleted
        const itemIndex = userCart.cartItems.findIndex(
          (item) => item.product.toString() === productId
        );
  
        if (itemIndex === -1) {
          return res.status(404).send({ message: "Item not found in cart" });
        }
  
        // Remove the item from the cart array
        userCart.cartItems.splice(itemIndex, 1);
  
        // Save the updated cart
        const savedCart = await userCart.save();
        res.status(200).send({ message: "Item removed from cart", cart: savedCart });
      } catch (error) {
        console.error("Error removing item from cart:", error);
        res.status(500).send({ message: "Internal Server Error" });
      }
    })
  );
  
  cartRouter.delete(
    "/",
    isAuth,
    expressAsyncHandler(async (req, res) => {
      try {
        const userCart = await Cart.findOneAndDelete({ user: req.user._id });
  
        if (!userCart) {
          return res.status(404).send({ message: "Cart not found" });
        }
  
        res.status(200).send({ message: "Cart deleted" });
      } catch (error) {
        console.error("Error deleting cart:", error);
        res.status(500).send({ message: "Internal Server Error" });
      }
    })
  );
  


  
export default cartRouter;