import express from "express";
import Product from "../modelss/productModel.js";
import expressAsyncHandler from "express-async-handler";
import {isAuth,isAdmin} from '../utils.js'
import WishlistItem from "../modelss/wishlistModel.js";

const wishlistRouter = express.Router();


wishlistRouter.post(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { wishlistItems } = req.body;

    // Validate incoming data
    if (!wishlistItems || !Array.isArray(wishlistItems)) {
      return res.status(400).send({ message: "Invalid wishlist items data" });
    }

    try {
      let userWishlist = await WishlistItem.findOne({ user: req.user._id });

      if (!userWishlist) {
        // If user doesn't have a wishlist, create a new one
        userWishlist = new WishlistItem({
          wishlistItems: [],
          user: req.user._id,
        });
      }

      // Add the new wishlist items to the existing wishlist
      wishlistItems.forEach((item) => {
        const existingItemIndex = userWishlist.wishlistItems.findIndex(
          (i) => i.product.toString() === item.product
        );

        if (existingItemIndex !== -1) {
          // If item already exists in wishlist, update its quantity
          userWishlist.wishlistItems[existingItemIndex].quantity += item.quantity;
        } else {
          // If item doesn't exist, add it to the wishlist
          userWishlist.wishlistItems.push({
            slug: item.slug,
            name: item.name,
            quantity: item.quantity,
            image: item.image,
            price: item.price,
            product: item.product,
          });
        }
      });

      // Save the updated or new wishlist
      const savedWishlist = await userWishlist.save();
      res.status(201).send({ message: "Wishlist updated", wishlist: savedWishlist });
    } catch (error) {
      console.error("Error updating wishlist:", error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  })
);


wishlistRouter.get(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const wishlistItems = await WishlistItem.find({ user: req.user._id });
    res.status(200).send(wishlistItems);
  })
);



export default wishlistRouter;
