import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { productsData } from "../Products";
import { WishlistContext } from "../WishListContextProvider";
import Navbar from "../navbar/Navbar";
import "./WishListItem.css";
import { WishListItem } from "./WishListItem";
import React, { useState, useEffect } from "react";
import wishlistimg from "../assets/wishlistimg.jpg";
function WishList() {
  const { wishListItems, wishlist } = useContext(WishlistContext);
  const navigate = useNavigate();

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
          {productsData.map((product) => {
            if (wishListItems[product.id] !== 0) {
              return <WishListItem data={product} />;
            }
          })}
        </div>
      </div>
    </div>
  );
}
export default WishList;
