import { createContext, useReducer } from "react";
import React from "react";

export const Store = createContext();

//DACA MAI AM PROBLEME CU INITIAL STATE AR TREBUI SA AM  userInfo: localStorage.getItem("userInfo")===UNDEFINED
const initialState = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,

  cart: {
    shippingAddress: localStorage.getItem("shippingAddress")
      ? JSON.parse(localStorage.getItem("shippingAddress"))
      : {},
    paymentMethod: localStorage.getItem("paymentMethod")
      ? localStorage.getItem("paymentMethod")
      : "",
      
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
  },
};


function reducer(state, action) {
  switch (action.type) {
    case "CART_ADD_ITEM":
      //add to cart
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item._id === existItem._id ? newItem : item
          )
        : [...state.cart.cartItems, newItem];

      localStorage.setItem("cartItems", JSON.stringify(cartItems));

      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems,
        },
      };

    case "CART_REMOVE_ITEM": {
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== action.payload._id
      );
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case "CART_CLEAR":
      return { ...state, cart: { ...state.cart, cartItems: [] } };

    case "USER_SIGNIN":
      return { ...state, userInfo: action.payload };
    case "USER_SIGNOUT":
      localStorage.removeItem("userInfo"); // Remove user info from localStorage
      localStorage.removeItem("cartItems"); // Remove wishlist items from localStorage
      return {
        ...state,
        userInfo: null,
        cart: {
          cartItems: [],
          shippingAddress: {},
          paymentMethod: "",
        },
      };

    case "SAVE_SHIPPING_ADDRESS":
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: action.payload,
        },
      };
    case "SAVE_PAYMENT_METHOD":
      return {
        ...state,
        cart: {
          ...state.cart,
          paymentMethod: action.payload,
        },
      };

      
      case "CART_SET_ITEMS":
        localStorage.setItem("cartItems", JSON.stringify(action.payload));
        return {
          ...state,
          cart: {
            ...state.cart,
            cartItems: action.payload,
          },
        };

        case "CART_UPDATE_QUANTITY":
          const { product, newQuantity } = action.payload;
          const updatedCartItems = state.cart.cartItems.map((item) => {
            if (item._id === product._id) {
              return { ...item, quantity: newQuantity };
            }
            return item;
          });
          localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
          return {
            ...state,
            cart: {
              ...state.cart,
              cartItems: updatedCartItems,
            },
          };
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
