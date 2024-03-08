import { useContext } from "react";
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
  } = state;

  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`);

    console.log(quantity);
    if (data.stoc < quantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }

    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });
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
                          onClick={() =>
                            updateCartHandler(product, product.quantity - 1)
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
                          onClick={() =>
                            updateCartHandler(product, product.quantity + 1)
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
