import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../navbar/Navbar";
import React, { useState, useEffect } from "react";
import wishlistimg from "../assets/wishlistimg.jpg";
import { Wishlist } from "../W";
import { Trash } from "phosphor-react";

function WishList() {
  const navigate = useNavigate();
  const { stateW, dispatch: ctxDispatch } = useContext(Wishlist);
  const {
    wishlist: { wishlistItems },
  } = stateW;

  const removeItemHandler = (item) => {
    ctxDispatch({ type: "WISHLIST_REMOVE_ITEM", payload: item });
  };
  const [scrollOpacity, setScrollOpacity] = useState(1);

  const handleScroll = () => {
    const scrollOffset = window.scrollY;
    const opacity = Math.max(0, 1 - scrollOffset / 900); // Adjust the value (400) based on when you want the image to disappear
    setScrollOpacity(opacity);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);


  console.log(wishlistItems)
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
            style={{ opacity: scrollOpacity }}
          />

          <div className="centered">Your Wishlist Items</div>
        </div>
        <div className="cartItems">
              {wishlistItems.map((product) => (
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
    </div>
  );
}
export default WishList;
