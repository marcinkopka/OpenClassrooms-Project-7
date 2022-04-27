import React from 'react';
import classes from './Rating.module.css';

const starsRating = (props) => {
  
  // Preparing rating
  let ratingContent = null;
  let rating;
  let percentRating;
  //  When rating is available
  if ((props.rating) && (props.rating !== 0)) {
    rating = props.rating;
    // Checking if rating is fixed to one decimal number
    if (rating % 1 === 0) {
      if (typeof rating === 'string') {
        rating = Number(rating);
      }
      // If not then setting it to one decimal number
      rating = rating.toFixed(1);
    }
    percentRating = props.rating * 20;
    ratingContent = (
      <div className={classes.Rating}>
        <div className={classes.RatingNumber}>
          {rating}
        </div>
        <div className={classes.RatingStars}>
          <div className={classes.StarsRatingSprite}>
            <span className={classes.StarsRatingSpriteRating} style={{width: percentRating + '%'}}>
            </span>
          </div>
        </div>
      </div>
    );
  } else {
    //  When rating is not available
    ratingContent = (
      <div className={classes.NoRating}>
        <p>No rating yet</p>
      </div>
    );
  }
  
  return (
    <React.Fragment>
      {ratingContent}
    </React.Fragment>
  );
}

export default starsRating;
