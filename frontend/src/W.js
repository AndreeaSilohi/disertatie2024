import { createContext, useReducer } from "react";
import React from "react";

export const Wishlist = createContext();

const initialstateW = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,

  wishlist: {
    shippingAddress: localStorage.getItem("shippingAddress")
      ? JSON.parse(localStorage.getItem("shippingAddress"))
      : {},
    paymentMethod: localStorage.getItem("paymentMethod")
      ? localStorage.getItem("paymentMethod")
      : "",
    wishlistItems: localStorage.getItem("wishlistItems")
      ? JSON.parse(localStorage.getItem("wishlistItems"))
      : [],
  },
};

function reducer(stateW, action) {
  switch (action.type) {
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

    case "USER_SIGNIN":
      return { ...stateW, userInfo: action.payload };
    case "USER_SIGNOUT":
      return {
        ...stateW,
        userInfo: null,
        wishlist: {
          wishlistItems: [],
          shippingAddress: {},
          paymentMethod: "",
        },
      };

    case "SAVE_SHIPPING_ADDRESS":
      return {
        ...stateW,
        wishlist: {
          ...stateW.wishlist,
          shippingAddress: action.payload,
        },
      };
    case "SAVE_PAYMENT_METHOD":
      return {
        ...stateW,
        wishlist: {
          ...stateW.wishlist,
          paymentMethod: action.payload,
        },
      };

    default:
      return stateW;
  }
}

export function WishlistProvider(props) {
  const [stateW, dispatch] = useReducer(reducer, initialstateW);
  const value = { stateW, dispatch };
  return <Wishlist.Provider value={value}>{props.children}</Wishlist.Provider>;
}
