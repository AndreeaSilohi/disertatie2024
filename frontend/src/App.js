import "./App.css";
import Footer from "./Footer";
import HomePage from "./Home/HomePage";
import About from "./About/About";
import Contact from "./Contact/Contact";
import OurShop from "./OurShop/OurShop";
import Profile from "./SignIn/SignIn";
import React from "react";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ContactForm from "./ContactForm/ContactForm";
import ProductDetails from "./ProductDetails/ProductDetails";
import Curiosities from "./Curiosities/Curiosities";
import Cart from "./Cart/Cart";
import { StoreProvider } from "./Store";
import { WishlistProvider } from "./WishListContextProvider";
import WishList from "./Wishlist/Wishlist";
import Drawer from "./Drawer/Drawer";
import ShippingAddress from "./ShippingAddress/ShippingAddress";
import SignUp from "./SignUp/SignUp";
import PaymentMethod from "./PaymentMethod/PaymentMethod";
import PlaceOrder from "./PlaceOrder/PlaceOrder";
import OrderScreen from "./orderScreen/OrderScreen";
import OrderHistory from "./OrderHistory/OrderHistory";
import ProfileScreen from "./Profile/ProfileScreen";
import SearchScreen from "./SearchScreen/SearchScreen";

function App() {
  return (
    <WishlistProvider>
      <StoreProvider>
        <Router>
          <div
            style={{
              fontFamily: "sans-serif",
              width: "100%",
              minHeight: "100vh",
            }}
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<OurShop />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/contact-form" element={<ContactForm />} />
              <Route path="/product/:slug" element={<ProductDetails />} />
              <Route path="/curiosities" element={<Curiosities />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/signin" element={<Profile />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/profile" element={<ProfileScreen />} />
              <Route path="/wishlist" element={<WishList />} />
              <Route path="/drawer" element={<Drawer />} />
              <Route path="/shipping" element={<ShippingAddress />} />
              <Route path="/payment" element={<PaymentMethod />} />
              <Route path="/placeorder" element={<PlaceOrder />} />
              <Route path="/order/:id" element={<OrderScreen />} />
              <Route path="/orderhistory" element={<OrderHistory />} />
              <Route path="/search" element={<SearchScreen />} />
            </Routes>
          </div>
          <div>
            <Footer />
          </div>
        </Router>
      </StoreProvider>
    </WishlistProvider>
  );
}

export default App;
