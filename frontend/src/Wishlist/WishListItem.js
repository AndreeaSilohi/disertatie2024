import React, { useState, useContext } from "react";
import { WishlistContext } from "../WishListContextProvider";
import "./Wishlist.css";

import { ShopContext } from "../ShopContextProvider";

export const WishListItem = (props) => {
  const [notification, setNotification] = useState(null);
  const { id, name, price, image, stoc } = props.data;

  const { addToCart } = useContext(ShopContext); // Use the ShopContext

  const handleAddToCart = () => {
    addToCart(id);
    setNotification(` Ai adaugat ${decodeURIComponent(name)} in cos`);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };
  return (
    <div className="wishlist">
      <div className="wishlist-content">
        <div className="wishlist-content-name-img">
          <div>
            <img src={image} />
          </div>
          <div className="wishlist-name-product">
            <p style={{ maxWidth: "220px" }}>{name} </p>
          </div>
        </div>

        <div className="wishlist-price">{price} lei</div>
        <div className="wishlist-stock">
          {stoc > 1 ? "In Stock" : "Out of Stock"}
        </div>

        <div className="add-to-cart" onClick={handleAddToCart}>
          ADD TO CART
        </div>
      </div>
      {notification && <div className="notification">{notification}</div>}
    </div>
  );
};
