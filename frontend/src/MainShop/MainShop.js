import React, { useContext } from "react";
import { Store } from "../Store";
import SearchScreen from "../SearchScreen/SearchScreen";
import Shop from "../OurShop/OurShop";

const MainShop= () => {
  const { state: { userInfo } } = useContext(Store);

  return (
    <>
      {userInfo ? <SearchScreen /> : <Shop />}
    </>
  );
}

export default MainShop;
