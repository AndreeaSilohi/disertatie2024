import React, { createContext, useState } from "react";
import { productsData } from "./Products";
export const WishlistContext = createContext(null);

const getDefaultWish = () => {
  let wish = {};

  for (let i = 1; i < productsData.length + 1; i++) {
    wish[i] = 0;
  }
  return wish;
};
export const WishlistProvider = (props) => {
  const [wishListItems, setWishListItems] = useState(getDefaultWish());
   const [wishlist, setWishlist] = useState([]);

  const addToWishlist = (itemId) => {
    setWishListItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
  };

  const removeFromWishlist = (productName) => {
    setWishlist(wishlist.filter((item) => item !== productName));
  };

  const contextValue = {
    wishListItems,
    addToWishlist,
    
  };
  return (
    <WishlistContext.Provider
      value={contextValue}
    >
      {props.children}
    </WishlistContext.Provider>
  );
};


