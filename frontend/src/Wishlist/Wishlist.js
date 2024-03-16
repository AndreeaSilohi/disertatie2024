import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Wishlist } from "../W";
import { Trash } from "phosphor-react";
import axios from "axios";
import wishlistimg from "../assets/wishlistimg.jpg";
import Navbar from "../navbar/Navbar";

function WishList() {
  const navigate = useNavigate();
  const { stateW, dispatch: ctxDispatch } = useContext(Wishlist);
  const {
    wishlist: { wishlistItems },
    userInfo,
  } = stateW;

  useEffect(() => {
    const fetchWishlistItems = async () => {
      try {
        const { data } = await axios.get("/api/wishlist", {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        ctxDispatch({ type: "WISHLIST_SET_ITEMS", payload: data });
      } catch (error) {
        console.error("Error fetching wishlist items:", error);
        // Handle error
      }
    };

    fetchWishlistItems();
  }, [ctxDispatch, userInfo.token]);


  console.log(wishlistItems[0].user)
  const removeItemHandler = async (item) => {
    try {
      await axios.delete(`/api/wishlist/${item._id}`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      ctxDispatch({ type: "WISHLIST_REMOVE_ITEM", payload: item });
    } catch (error) {
      console.error("Error removing wishlist item:", error);
      // Handle error
    }
  };

  return (
    <div className="wrapper-wishlist">
      <div className="wishList">
        <div className="navbar">
          <Navbar />
        </div>

        <div className="container-wishlist">
          <img
            className="background-wishlist"
            src={wishlistimg}
            alt="Background"
          />
          <div className="centered">Your Wishlist Items</div>
        </div>

        <div className="cartItems">
          {wishlistItems.map((wishlistItem) => (
            <div key={wishlistItem._id} className="cart-table">
              <div className="table-content">
                <div className="table-content-1">
                  <div className="img">
                    <img src={wishlistItem.image} alt={wishlistItem.name} />
                    <div
                      onClick={() => navigate(`/product/${wishlistItem.slug}`)}
                    >
                      {wishlistItem.name}
                    </div>
                  </div>
                </div>
                <div className="table-content-2">{wishlistItem.price}</div>
                <div
                  className="table-content-4"
                  onClick={() => removeItemHandler(wishlistItem)}
                >
                  <Trash size={28} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WishList;
