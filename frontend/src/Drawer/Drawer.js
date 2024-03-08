import Box from "@mui/material/Box";
import Cart from "../Cart/Cart";
import React from "react";
import { SwipeableDrawer } from "@mui/material";
function Drawer() {
  const [stateCart, setstateCart] = React.useState({
    right: false,
  });
  const toggleDrawer = (anchor, open) => (event) => {
    console.log("something")
    if (
      event?.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setstateCart({ ...stateCart, [anchor]: open });
  };

  const list = (
    <Box
      sx={{
        width: 650,
        display: "flex",
      }}
      role="presentation"
      onClick={(event) => event.stopPropagation()}
      onKeyDown={toggleDrawer("right", false)}
    >
      <Cart />
    </Box>
  );

  return (
    <div onClick={toggleDrawer("right", true)}>
      <SwipeableDrawer
        anchor="right"
        open={stateCart["right"]}
        onClose={toggleDrawer("right", false)}
        onOpen={toggleDrawer("right", true)}
      >
        {list}
      </SwipeableDrawer>
    </div>
  );
}

export default Drawer;
