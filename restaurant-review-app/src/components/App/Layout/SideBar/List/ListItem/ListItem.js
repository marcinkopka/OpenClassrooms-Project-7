// This component is using Font Awesome icon under the Creative Commons Attribution 4.0 International license.
// This is link to the license: https://fontawesome.com/license
// Standard black color of icon has been changed in fill attribute of icon.

import React from 'react';
import classes from './ListItem.module.css';
import Rating from '../../Rating/Rating';
import restaurantIcon from '../../../../../../assets/icons/utensils-solid.svg';

const listItem = (props) => {
  
  // Preparing place photo
  let placePhotoUrl;
  if (props.placeData.photos && props.placeData.photos[0].getUrl()) {
    placePhotoUrl = props.placeData.photos[0].getUrl({maxWidth: 85, maxHeight: 85});
  } else {
    placePhotoUrl = restaurantIcon;
  }
  let placePicture = <img referrerPolicy='no-referrer' src={placePhotoUrl} alt='PlacePicture' />;
  
  //Preparing rating value
  let ratingValue;
  let index = props.lastAverageRatings.findIndex((elem) => (elem.place_id === props.placeData.place_id));
  if (index !== -1) {
    ratingValue = props.lastAverageRatings[index].lastAverageRating;
  } else {
    ratingValue = props.placeData.rating;
  }
  
  return (
    <div className={classes.ListItem} onClick={props.restaurantDetailsShowHandler}>
      <div className={classes.PlaceDescription}>
        <div className={classes.PlaceName}>
          {props.placeData.name}
        </div>
        <div className={classes.PlaceVicinity}>
          {props.placeData.vicinity}
        </div>
        <div className={classes.AverageRating}>
          <Rating
            rating={ratingValue}
          />
        </div>
      </div>
      <div className={classes.PlacePhoto}>
        {placePicture}
      </div>
    </div>
  );
}

export default listItem;
