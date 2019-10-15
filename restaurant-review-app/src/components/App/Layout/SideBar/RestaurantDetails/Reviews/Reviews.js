import React from 'react';
import classes from './Reviews.module.css';
import AddReview from './AddReview/AddReview';
import Review from './Review/Review';

const reviews = (props) => {
  // Add review
  let addReviewContent;
  let addButtonContent;
  if (props.addingReviewStatus) {
    addButtonContent = 'Reset';
    addReviewContent = (
      <AddReview
        newReviewData={props.newReviewData}
        newReviewDataChangeHandler={props.newReviewDataChangeHandler}
        addReviewButtonDisabled={props.addReviewButtonDisabled}
        addReview={props.addReview}
        cancelAddingReview={props.cancelAddingReview}
      />
    );
  } else {
    addButtonContent = 'Add';
    addReviewContent = null;
  }
  // Reviews
  let reviews = null;
  if (props.reviewsData.length !== 0) {
    reviews = props.reviewsData.map((reviewElement, index) => {
      return (
        <Review 
          key={index}
          reviewData={reviewElement}
        />
      );
    });
  }
  
  return(
    <div className={classes.Reviews}>
      <div className={classes.Header}>
        <p>Reviews</p>
        <button onClick={props.addingReviewShowHandler}>{addButtonContent}</button>
      </div>
        {addReviewContent}
        {reviews}
    </div>
  );
}

export default reviews;
