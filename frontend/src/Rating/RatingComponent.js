import React from "react";
import Rating from "@mui/material/Rating";

function CustomRating(props) {
  const { rating, numReviews } = props;

  // Function to round to nearest half
  const roundHalf = (num) => Math.round(num * 2) / 2;

  return (
    <div className="rating">
      <Rating
        name="custom-rating"
        value={roundHalf(rating)}
        precision={0.5}
        readOnly
      />
      <span>{numReviews} reviews</span>
    </div>
  );
}

export default CustomRating;
