import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import React from 'react';
import './Cart.css';
import { Store } from '../Store';
import { Trash, X } from 'phosphor-react';
import Navbar from '../navbar/Navbar';
import axios from 'axios';
import { Divider } from '@mui/material';

function Cart() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
    userInfo,
  } = state;

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        if (!userInfo || !userInfo.token) {
          return;
        }
        const { data } = await axios.get('/api/cart', {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        console.log(data);

        ctxDispatch({
          type: 'CART_SET_ITEMS',
          payload: data.cartItems,
        });
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchCartItems();
  }, [ctxDispatch, userInfo]);

  const updateCartHandler = async (product, newQuantity, event) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      const { data } = await axios.get(`/api/products/${product.product}`);
      if (data.stoc < newQuantity) {
        window.alert('Sorry. Product is out of stock');
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
        type: 'CART_UPDATE_QUANTITY',
        payload: {
          product: { ...product }, // Update quantity in the product object
          newQuantity: newQuantity,
        },
      });
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
      window.alert(
        'Failed to update cart item quantity. Please try again later.'
      );
    }
  };

  const removeItemHandler = async (product) => {
    try {
      const response = await axios.delete(`/api/cart/${product.product}`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: product });
    } catch (error) {
      console.error('Error removing item from cart:', error);
      window.alert('Failed to remove item from cart. Please try again later.');
    }
  };

  const checkoutHandler = () => {
    navigate('/signin?redirect=/shipping');
  };
  console.log(cartItems);
  return (
    <div>
      <header className="header-cart">
        <div className="background-container-cart">
          <div className="overlay-text-cart">
            <h1 className="h1-title-cart">COȘ</h1>
          </div>
        </div>
      </header>
      <div className="wrapper">
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-1-div">
              <h1>COȘUL TĂU ESTE GOL</h1>
            </div>
            <div className="empty-cart-2-div">
              Shopping-ul este întotdeauna bun atunci când este vorba de produse
              de calitate. Dați click pe butonul de mai jos pentru a vă bucura
              de toate produsele.
            </div>

            <button
              onClick={() => navigate('/shop')}
              className="empty-cart-button"
            >
              SPRE MAGAZIN
            </button>
          </div>
        ) : (
          <div className="cart">
            <div className="table-header">
              <div className="table-header-1">produs</div>
              <div className="table-header-2">preț</div>
              <div className="table-header-3">cantitate</div>
            </div>

            <div className="cartItems">
              {cartItems.map((product) => (
                <div className="cart-table">
                  <div className="table-content">
                    <div className="table-content-1">
                      <div className="img">
                        <img src={product.image} alt={product.name}></img>{' '}
                        <div
                          onClick={() => navigate(`/product/${product.slug}`)}
                        >
                          {product.name}
                        </div>
                      </div>
                    </div>
                    <div className="table-content-2">{product.price}</div>

                    <div className="table-content-3">
                      <div className="plus-minus">
                        <button
                          // style={{color:"rgba(0, 0, 0, 0.653)"}}
                          onClick={(event) =>
                            updateCartHandler(
                              product,
                              product.quantity - 1,
                              event
                            )
                          }
                          disabled={product.quantity === 1}
                        >
                          {' '}
                          -{' '}
                        </button>
                      </div>
                      <div>
                        <span>{product.quantity}</span>
                      </div>
                      <div className="plus-minus">
                        <button
                          // style={{color:"rgba(0, 0, 0, 0.653)"}}
                          onClick={(event) =>
                            updateCartHandler(
                              product,
                              product.quantity + 1,
                              event
                            )
                          }
                          disabled={product.quantity === product.stoc}
                        >
                          {' '}
                          +{' '}
                        </button>
                      </div>
                    </div>
                    <div
                      className="table-content-4"
                      onClick={() => removeItemHandler(product)}
                    >
                      <Trash style={{ color: '#D77E2B' }} size={28} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {cartItems.length > 0 && (
          <div className="order-details">
            <h4>TOTAL</h4>
            <div className="checkout">
              {/* <p className="subtotal">
                Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}
                ): {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)} lei
              </p> */}
              <p className="subtotal">
                <b>Subtotal:</b>&nbsp;{' '}
                {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)} lei
              </p>
              <Divider />
              <p className="livrare">
                <b>Livrare:</b>&nbsp; trebuie să treci la pasul următor pentru a
                vedea metodele de livrare și costurile aferente acesteia.
              </p>
              <div className="buttons-subtotal">
                <button
                  onClick={() => navigate('/shop')}
                  className="button-subtotal"
                >
                  Continuă cumpărăturile
                </button>

                <button
                  className="button-subtotal"
                  disabled={cartItems.length === 0}
                  onClick={checkoutHandler}
                >
                  Către plată
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
