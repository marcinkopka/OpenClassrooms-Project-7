import React from 'react';
import classes from './AddReview.module.css';

const addReview = (props) => {
  let stars = null;
  let starsArray = [];
  let starValue;
  // Creating stars array
  for (let i = 0; i < 5; i++) {
    if (i >= props.newReviewData.userRating) {
      starValue = 0;
    } else {
      starValue = 1;
    }
    starsArray.push(starValue);
  }
  stars = starsArray.map((elem, index) => {
    if (elem === 0) {
      return <div key={index + 1} className={classes.StarNotRated} id={index + 1} onClick={props.newReviewDataChangeHandler}></div>
    } else {
      return <div key={index + 1} className={classes.StarRated} id={index + 1} onClick={props.newReviewDataChangeHandler}></div>
    }
  });
  
  return(
    <div className={classes.AddReview}>
      <form className={classes.Fields}>
        <div className={classes.Names}>
          <div className={classes.FirstName}>
            <input type='text' name='firstName' spellCheck='false' value={props.newReviewData.firstName} onChange={props.newReviewDataChangeHandler} required />
            <label>First Name *</label>
          </div>
          <div className={classes.LastName}>
            <input type='text' name='lastName' spellCheck='false' value={props.newReviewData.lastName} onChange={props.newReviewDataChangeHandler} required />
            <label>Last Name *</label>
          </div>
        </div>
        <div className={classes.Review}>
          <textarea rows='3' type='text' name='review' spellCheck='false' value={props.newReviewData.review} onChange={props.newReviewDataChangeHandler} required />
          <label>Review *</label>
        </div>
        <div className={classes.UserRating}>
          <div className={classes.Description}>Rating</div>
          <div className={classes.Stars}>{stars}</div>
        </div>
        <div className={classes.Buttons}>
          <button className={classes.Add} disabled={props.addReviewButtonDisabled} onClick={props.addReview}>Add</button>
          <button className={classes.Cancel} onClick={props.cancelAddingReview}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default addReview;
