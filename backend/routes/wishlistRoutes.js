import express from "express";
import expressAsyncHandler from "express-async-handler";
import {isAuth} from '../utils.js'
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
            quantity:item.quantity,
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
    try {
      const userWishlist = await WishlistItem.findOne({ user: req.user._id });
      if (!userWishlist) {
        // If user doesn't have a wishlist, return an empty array
        return res.status(200).send({ wishlistItems: [] });
      }
      res.status(200).send({ wishlistItems: userWishlist.wishlistItems });
    } catch (error) {
      console.error("Error fetching wishlist items:", error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  })
);

wishlistRouter.delete(
  "/:productId",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const userWishlist = await WishlistItem.findOne({ user: req.user._id });

      if (!userWishlist) {
        return res.status(404).send({ message: "Wishlist not found" });
      }

      const updatedWishlistItems = userWishlist.wishlistItems.filter(
        (item) => item.product.toString() !== req.params.productId
      );

      userWishlist.wishlistItems = updatedWishlistItems;
      const savedWishlist = await userWishlist.save();

      res.status(200).send({ message: "Item removed from wishlist", wishlist: savedWishlist });
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  })
);



export default wishlistRouter;
