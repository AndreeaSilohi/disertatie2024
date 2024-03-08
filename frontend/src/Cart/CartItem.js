import React, { useContext } from "react";
import { ShopContext } from "../ShopContextProvider";
import "./CartItem.css";

export const CartItem = (props) => {
  const { id, name, price, description, image, additional } = props.data;
  const { cartItems, addToCart, removeFromCart, updateCartItemCount } =
    useContext(ShopContext);

  return (
    <div className="cart-table">
      <div className="table-content">
        <div className="table-content-1">
          <div className="img">
            <img src={image} />
           
          </div>
          <div className="name">
          <p style={{maxWidth:"220px"}}>{name}</p>
          </div>
        </div>
        <div className="table-content-2">{price}</div>
        <div className="table-content-3">
          <div>
            <button onClick={() => removeFromCart(id)}> - </button>
          </div>
          <div>
            <input
            style={{textAlign:"center",background:"transparent"}}
              value={cartItems[id]}
              onChange={(e) => updateCartItemCount(Number(e.target.value), id)}
            />
          </div>
          <div>
            <button onClick={() => addToCart(id)}> + </button>
          </div>
        </div>
      </div>
    </div>
  );
};
