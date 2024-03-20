import { createContext, useReducer } from "react";
import React from "react";

export const Wishlist = createContext();

const initialstateW = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,

  wishlist: {
    wishlistItems: localStorage.getItem("wishlistItems")
      ? JSON.parse(localStorage.getItem("wishlistItems"))
      : [],
  },
};

function reducer(stateW, action) {
  switch (action.type) {
    case "CREATE_REQUEST":
      // Set loading or any other appropriate flag
      return { ...stateW, loading: true };
    case "USER_SIGNIN":
      // localStorage.setItem("userInfo", JSON.stringify(action.payload));
      return { ...stateW, userInfo: action.payload };

    case "USER_SIGNOUT":
      localStorage.removeItem("userInfo"); // Remove user info from localStorage
      localStorage.removeItem("wishlistItems"); // Remove wishlist items from localStorage
      return {
        ...stateW,
        userInfo: null,
        wishlist: {
          wishlistItems: [],
        },
      };

    case "WISHLIST_ADD_ITEM":
      //add to wishlist
      const newItem = action.payload;
      const existItem = stateW.wishlist.wishlistItems.find(
        (item) => item._id === newItem._id
      );
      const wishlistItems = existItem
        ? stateW.wishlist.wishlistItems.map((item) =>
            item._id === existItem._id ? newItem : item
          )
        : [...stateW.wishlist.wishlistItems, newItem];

      localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));

      return {
        ...stateW,
        wishlist: {
          ...stateW.wishlist,
          wishlistItems,
        },
      };
    case "WISHLIST_SET_ITEMS":
      localStorage.setItem("wishlistItems", JSON.stringify(action.payload));
      return {
        ...stateW,
        wishlist: {
          ...stateW.wishlist,
          wishlistItems: action.payload,
        },
      };
    case "WISHLIST_REMOVE_ITEM": {
      const wishlistItems = stateW.wishlist.wishlistItems.filter(
        (item) => item._id !== action.payload._id
      );
      localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
      return { ...stateW, wishlist: { ...stateW.wishlist, wishlistItems } };
    }
    case "WISHLIST_CLEAR":
      return { ...stateW, wishlist: { ...stateW.wishlist, wishlistItems: [] } };

    default:
      return stateW;
  }
}

export function WishlistProvider(props) {
  const [stateW, dispatch] = useReducer(reducer, initialstateW);
  const value = { stateW, dispatch };
  return <Wishlist.Provider value={value}>{props.children}</Wishlist.Provider>;
}
