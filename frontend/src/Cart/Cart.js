import { useContext,useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
//nu elimin cartItem cred ca foloseste stiluri de acolo
// import { CartItem } from "./CartItem";

import React from "react";
import "./Cart.css";
import { Store } from "../Store";
import { Trash } from "phosphor-react";
import Navbar from "../navbar/Navbar";
import axios from "axios";
//folosesc stiluri din cartItem

function Cart() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
    userInfo
  } = state;


  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        if (!userInfo || !userInfo.token) {
          // If userInfo or token is not available, return early
          return;
        }
        const { data } = await axios.get("/api/cart", {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });

        ctxDispatch({
          type: "CART_SET_ITEMS",
          payload: data.cartItems,
        });
      } catch (error) {
        console.error("Error fetching cart items:", error);
        // Log specific error details
        console.error("Error details:", error.response || error.message);
        // Handle error
      }
    };
    

    fetchCartItems();
  }, [ctxDispatch, userInfo]);



  const updateCartHandler = async (product, quantity,event) => {
    event.preventDefault();
    event.stopPropagation();

    console.log(product)
    console.log(quantity)
    try {
      // Check stock availability
      const { data } = await axios.get(`/api/products/${product.product}`);
      console.log(data)
      

      if (data.stoc < quantity) {
        window.alert("Sorry. Product is out of stock");
        return;
      }

      // Send a POST request to add the item to the cart
      const response = await axios.post(
        "/api/cart",
        {
          quantity: quantity,
          slug: product.slug,
          name: product.name,
          image: product.image,
          price: product.price,
          productId: product.product, // Ensure productId is provided correctly
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`, // Assuming userInfo contains user token
          },
        }
      );

      // Dispatch action to update the cart in the context/state
      ctxDispatch({
        type: "CART_ADD_ITEM",
        payload: { ...product, quantity }, // Assuming the server responds with the updated cart data
      });

      // Show notification or handle success
      console.log(`${product.name} was added to the cart`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      window.alert("Failed to add to cart. Please try again later.");
    }
  };
  


  const removeItemHandler = (item) => {
    ctxDispatch({ type: "CART_REMOVE_ITEM", payload: item });
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
                      {/* <div className="name">
                    <p style={{ maxWidth: "220px" }}>{item.name}</p>
                  </div> */}
                    </div>
                    <div className="table-content-2">{product.price}</div>

                    <div className="table-content-3">
                      <div>
                        <button
                          onClick={(event) =>
                            updateCartHandler(product, product.quantity - 1,event)
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
                            updateCartHandler(product, product.quantity + 1,event)
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
