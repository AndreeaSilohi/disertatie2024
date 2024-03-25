import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import React from "react";
import "./Cart.css";
import { Store } from "../Store";
import { Trash } from "phosphor-react";
import Navbar from "../navbar/Navbar";
import axios from "axios";

function Cart() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
    userInfo,
  } = state;

  // useEffect(() => {
  //   const fetchCartItems = async () => {
  //     try {
  //       if (!userInfo || !userInfo.token) {
  //         return;
  //       }
  //       const { data } = await axios.get("/api/cart", {
  //         headers: {
  //           Authorization: `Bearer ${userInfo.token}`,
  //         },
  //       });

  //       ctxDispatch({
  //         type: "CART_SET_ITEMS",
  //         payload: data.cartItems,
  //       });
  //     } catch (error) {
  //       console.error("Error fetching cart items:", error);
  //     }
  //   };

  //   fetchCartItems();
  // }, [ctxDispatch, userInfo]);

  const updateCartHandler = async (product, newQuantity, event) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      console.log(product.product);
      const { data } = await axios.get(`/api/products/${product.product}`);
      

      // const existItem = cartItems.find((x) => x.product === product.product);
      
      // const quantity = existItem ? existItem.quantity + 1 : 1;
   
      if (data.stoc < newQuantity) {
        window.alert("Sorry. Product is out of stock");
        return;
      }

      const response = await axios.put(
        `/api/cart/${product.product}`, // assuming _id is the identifier of the product
        { quantity: newQuantity },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      // Dispatch CART_UPDATE_QUANTITY action to update the quantity locally
      ctxDispatch({
        type: "CART_UPDATE_QUANTITY",
        payload: {
          product: { ...product, quantity: newQuantity }, // Update quantity in the product object
          newQuantity: newQuantity,
        },
      });

      console.log(`${product.name} quantity updated in the cart`);
    } catch (error) {
      console.error("Error updating cart item quantity:", error);
      window.alert(
        "Failed to update cart item quantity. Please try again later."
      );
    }
  };

  // const removeItemHandler = (item) => {
  //   ctxDispatch({ type: "CART_REMOVE_ITEM", payload: item });
  // };

  const removeItemHandler = async (product) => {
    try {
      const response = await axios.delete(`/api/cart/${product.product}`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      ctxDispatch({ type: "CART_REMOVE_ITEM", payload: product });
    } catch (error) {
      console.error("Error removing item from cart:", error);
      window.alert("Failed to remove item from cart. Please try again later.");
    }
  };

  const checkoutHandler = () => {
    navigate("/signin?redirect=/shipping");
  };

  return (
    <div>
      <div className="navbar">
        <Navbar />
      </div>
      <header className="header-cart">
        <div className="background-container-cart">
          <div className="overlay-text-cart">
            <h1 className="h1-title-cart">CART</h1>
          </div>
        </div>
      </header>

      <div className="wrapper">
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-1-div">
              <h1>YOUR CART IS CURRENTLY EMPTY</h1>
            </div>
            <div className="empty-cart-2-div">
              Why not return to our amazing shop and start filling it with
              products. Just click on the button below to instantly get back to
              the shop page. Oh, and while you’re there, check out all of our
              mind-blowing discounts.
            </div>

            <button
              onClick={() => navigate("/shop")}
              className="empty-cart-button"
            >
              RETURN TO SHOP
            </button>
          </div>
        ) : (
          <div className="cart">
            <div className="cartTitle">
              <p>Cosul tau </p>
            </div>
            <div className="table-header">
              <div className="table-header-1">PRODUCT</div>
              <div className="table-header-2">PRICE</div>
              <div className="table-header-3">QUANTITY</div>
            </div>
            <div className="cartItems">
              {cartItems.map((product) => (
                <div className="cart-table">
                  <div className="table-content">
                    <div className="table-content-1">
                      <div className="img">
                        <img src={product.image} alt={product.name}></img>{" "}
                        <div
                          onClick={() => navigate(`/product/${product.slug}`)}
                        >
                          {product.name}
                        </div>
                      </div>
                    </div>
                    <div className="table-content-2">{product.price}</div>

                    <div className="table-content-3">
                      <div>
                        <button
                          onClick={(event) =>
                            updateCartHandler(
                              product,
                              product.quantity - 1,
                              event
                            )
                          }
                          disabled={product.quantity === 1}
                        >
                          {" "}
                          -{" "}
                        </button>
                      </div>
                      <div>
                        <span>{product.quantity}</span>
                      </div>
                      <div>
                        <button
                          disabled={product.quantity === product.stoc}
                          onClick={(event) =>
                            updateCartHandler(
                              product,
                              product.quantity + 1,
                              event
                            )
                          }
                        >
                          {" "}
                          +{" "}
                        </button>
                      </div>
                    </div>
                    <div
                      className="table-content-4"
                      onClick={() => removeItemHandler(product)}
                    >
                      <Trash size={28} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {cartItems.length > 0 && (
          <div className="order-details">
            <p>CART TOTALS</p>
            <div className="checkout">
              <p className="subtotal">
                Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)} items
                ): {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)} lei
              </p>
              <div className="buttons-subtotal">
                <button
                  onClick={() => navigate("/shop")}
                  className="button-subtotal"
                >
                  Continue Shopping
                </button>

                <button
                  className="button-subtotal"
                  disabled={cartItems.length === 0}
                  onClick={checkoutHandler}
                >
                  Proceed to checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
