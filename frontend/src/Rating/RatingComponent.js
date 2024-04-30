import React from "react";
import Rating from "@mui/material/Rating";

function CustomRating(props) {
  const { rating, numReviews, caption } = props;

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
      {caption ? <span>{caption}</span> : <span>{numReviews} recenzii</span>}
    </div>
  );
}

export default CustomRating;
