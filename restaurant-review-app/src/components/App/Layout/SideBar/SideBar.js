import React from 'react';
import Filter from './Filter/Filter';
import List from './List/List';
import RestaurantDetails from './RestaurantDetails/RestaurantDetails';

const sidebar = (props) => {
  
  let sideBarContent = null;
  
  if (!props.restaurantDetailsShowStatus) {
    
    sideBarContent = (
      <React.Fragment>
        <Filter
          filterData={props.filterData}
          filterButtonsDisabled={props.filterButtonsDisabled}
          updateFiltersHandler={props.updateFiltersHandler}
          resetFilter={props.resetFilter}
        />
        <List 
          googlePlacesFiltered={props.googlePlacesFiltered}
          listStatus={props.listStatus}
          restaurantDetailsShowHandler={props.restaurantDetailsShowHandler}
          lastAverageRatings={props.lastAverageRatings}
        />
      </React.Fragment>
    );
    
  } else {
    
    sideBarContent = (
      <React.Fragment>
        <RestaurantDetails
          restaurantDetailsData={props.restaurantDetailsData}
          restaurantDetailsHideHandler={props.restaurantDetailsHideHandler}
          addingReviewStatus={props.addingReviewStatus}
          addingReviewShowHandler={props.addingReviewShowHandler}
          newReviewData={props.newReviewData}
          newReviewDataChangeHandler={props.newReviewDataChangeHandler}
          addReviewButtonDisabled={props.addReviewButtonDisabled}
          addReview={props.addReview}
          cancelAddingReview={props.cancelAddingReview}
          newReviews={props.newReviews}
          countAverageRating={props.countAverageRating}
          getLastAverageRating={props.getLastAverageRating}
        />
      </React.Fragment>
    );
  }
  
  return(
    <React.Fragment>
      {sideBarContent}
    </React.Fragment>
  );
}

export default sidebar;
