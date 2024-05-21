import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wishlist } from '../W';
import { Trash } from 'phosphor-react';
import axios from 'axios';
import './Wishlist.css';

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
        if (!userInfo || !userInfo.token) {
          // If userInfo or token is not available, return early
          return;
        }
        const { data } = await axios.get('/api/wishlist', {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        console.log(data);
        ctxDispatch({
          type: 'WISHLIST_SET_ITEMS',
          payload: data.wishlistItems,
        });
      } catch (error) {
        console.error('Error fetching wishlist items:', error);
        // Handle error
      }
    };

    fetchWishlistItems();
  }, [ctxDispatch, userInfo]);

  const removeItemHandler = async (item) => {
    try {
      await axios.delete(`/api/wishlist/${item.product}`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      ctxDispatch({ type: 'WISHLIST_REMOVE_ITEM', payload: item });
    } catch (error) {
      console.error('Error removing item from wishlist:', error);
    }
  };

  return (
    <div>
      <header className="header-wishlist">
        <div className="overlay-text-wishlist">
          <h1 className="h1-title-wishlist">PRODUSE FAVORITE</h1>
        </div>
      </header>
      <div className="wishlist-container">
        <div className="wishlist-items">
          {wishlistItems.map((wishlistItem, index) => (
            <div key={index} className="wishlist-card">
              <img src={wishlistItem.image} alt={wishlistItem.name} />
              <div className="wishlist-card-content">
                <h3 onClick={() => navigate(`/product/${wishlistItem.slug}`)}>
                  {wishlistItem.name}
                </h3>
                <p>{wishlistItem.price} lei</p>
                <Trash
                  size={24}
                  className="trash-icon"
                  onClick={() => removeItemHandler(wishlistItem)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WishList;
