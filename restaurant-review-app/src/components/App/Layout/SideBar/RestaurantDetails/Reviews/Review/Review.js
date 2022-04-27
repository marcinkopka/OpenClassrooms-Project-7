import React from 'react';
import classes from './Review.module.css';
import Rating from '../../../Rating/Rating';

const review = (props) => {
  // Preparing author picture
  let authorPhoto;
  if (props.reviewData.profile_photo_url) {
    authorPhoto = <img referrerPolicy='no-referrer' src={props.reviewData.profile_photo_url} alt='AuthorPhoto' />;
  } else {
    authorPhoto = (
      <div className={classes.AuthorLetterContainer}>
        <span className={classes.AuthorLetter}>{props.reviewData.author_name.charAt(0)}</span>
      </div>
    );
  }
  
  return(
    <div className={classes.ReviewContainer}>
      <div className={classes.AuthorPhoto}>
        {authorPhoto}
      </div>
      <div className={classes.Review}>
        <div className={classes.AuthorName}>
          {props.reviewData.author_name}
        </div>
        <div className={classes.ReviewRating}>
          <Rating
            rating={props.reviewData.rating}
          />
        </div>
        <div className={classes.ReviewText}>
          {props.reviewData.text}
        </div>
      </div>
    </div>
  );
}

export default review;
