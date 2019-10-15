// This component is using Font Awesome icons under the Creative Commons Attribution 4.0 International license.
// This is link to the license: https://fontawesome.com/license
// Standard black colors of some icons has been changed in fill attribute of icons.

import React, { Component } from 'react';
import classes from './RestaurantDetails.module.css';
import closeIcon from '../../../../../assets/icons/times-circle-regular.svg';
import addressIcon from '../../../../../assets/icons/map-marker-alt-solid.svg';
import phoneIcon from '../../../../../assets/icons/phone-solid.svg';
import websiteIcon from '../../../../../assets/icons/at-solid.svg';
import Reviews from './Reviews/Reviews';
import Rating from '../Rating/Rating';

class RestaurantDetails extends Component {
  
  componentDidMount() {
    document.getElementById('top').scrollIntoView();
  }
  
  render() {
    let lat;
    let lng;
    if (typeof (this.props.restaurantDetailsData.place_id) === 'number') {
      lat = this.props.restaurantDetailsData.lat;
      lng = this.props.restaurantDetailsData.lng;
    } else {
      lat = this.props.restaurantDetailsData.geometry.location.lat();
      lng = this.props.restaurantDetailsData.geometry.location.lng();
    }
    // Creating street view image request
    let streetViewRequest = 'https://maps.googleapis.com/maps/api/streetview?size=640x350&location=' + lat + ',' + lng + '&fov=120&key=AIzaSyDFGGReY_Bo9Ftg6uqduepO2r7NV7fvCg4';
    // Preparing place phone number
    let phoneNumber;
    if (this.props.restaurantDetailsData.placeDetails.formatted_phone_number) {
      phoneNumber = this.props.restaurantDetailsData.placeDetails.formatted_phone_number;
    } else {
      phoneNumber = 'Not Available';
    }
    // Preparing place website address
    let websiteAddress;
    if (this.props.restaurantDetailsData.placeDetails.website) {
      websiteAddress = this.props.restaurantDetailsData.placeDetails.website;
    } else {
      websiteAddress = 'Not Available';
    }
    
    let reviewsData = [];
    let rating = this.props.restaurantDetailsData.rating;
    
    if (this.props.newReviews.length !== 0 ) {
      let index = this.props.newReviews.findIndex((elem) => (elem.place_id === this.props.restaurantDetailsData.place_id));
      if (index !== -1) {
        this.props.newReviews[index].reviews.forEach((elem => {
          reviewsData.push(elem);
        }));
      }
    }
    if (this.props.restaurantDetailsData.placeDetails.reviews) {
      this.props.restaurantDetailsData.placeDetails.reviews.forEach((elem => {
        reviewsData.push(elem);
      }));
    }
    if (reviewsData.length !== 0) {
      rating = this.props.countAverageRating(reviewsData).toFixed(1);
    } else {
      rating = 0;
    }
    this.props.getLastAverageRating(rating);
    
    return(
      <div className={classes.RestaurantDetails}>
        <div className={classes.Title} id='top'>
          <div className={classes.NameAndClose}>
            <div className={classes.Name}>
              {this.props.restaurantDetailsData.name}
            </div>
            <div className={classes.Close} title='Close'>
              <img src={closeIcon} alt='closeIcon' onClick={this.props.restaurantDetailsHideHandler} />
            </div>
          </div>
          <div className={classes.AverageRating}>
            <Rating
              rating={rating}
            />
          </div>
        </div>
        <div className={classes.StreetVievContainer}>
          <img src={streetViewRequest} alt='Static Street View' />
        </div>
        <div className={classes.AddressInfo}>
          <img src={addressIcon} alt='addressIcon' />
          <p>{this.props.restaurantDetailsData.vicinity}</p>
        </div>
        <div className={classes.PhoneInfo}>
          <img src={phoneIcon} alt='phoneIcon' />
          <p>{phoneNumber}</p>
        </div>
        <div className={classes.WebsiteInfo}>
          <img src={websiteIcon} alt='websiteIcon' />
          <p>
            <a href={this.props.restaurantDetailsData.placeDetails.website} target='_blank'>
              {websiteAddress}
            </a>
          </p>
        </div>
        <Reviews 
          reviewsData={reviewsData}
          addingReviewStatus={this.props.addingReviewStatus}
          addingReviewShowHandler={this.props.addingReviewShowHandler}
          newReviewData={this.props.newReviewData}
          newReviewDataChangeHandler={this.props.newReviewDataChangeHandler}
          addReviewButtonDisabled={this.props.addReviewButtonDisabled}
          addReview={this.props.addReview}
          cancelAddingReview={this.props.cancelAddingReview}
        />
      </div>
    );
  }
}

export default RestaurantDetails;
