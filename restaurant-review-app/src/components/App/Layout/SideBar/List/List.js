import React from 'react';
import classes from './List.module.css';
import ListItem from './ListItem/ListItem';

const list = (props) => {
  
  let listItems;
  
  switch (props.listStatus) {
    case 'loading':
      listItems = <p>LOADING...</p>;
      break;
    case 'notFound':
      listItems = (
        <p className={classes.NotFound}>
          There is no restaurant within 500 meters of the map center. Please move the map to change center of the map.
        </p>
      );
      break;
    case 'notInMapBounds':
      listItems = (
        <p className={classes.NotFound}>
          There is no restaurants within actual map area. Please decrease zoom level or move the map.
        </p>
      );
      break;
    case 'notInFilterCriteria':
      listItems = (
        <p className={classes.NotFound}>
          There is no restaurants to display for actual filter criteria. Please change filter criteria or move a map.
        </p>
      );
      break;
    case 'loaded':
      listItems = props.googlePlacesFiltered.map((placeElement) => {
        return (
          <ListItem 
            key={placeElement.place_id}
            placeData={placeElement}
            restaurantDetailsShowHandler={props.restaurantDetailsShowHandler.bind(null, placeElement.place_id)}
            lastAverageRatings={props.lastAverageRatings}
          />
        );
      });
      break;
    default:
      listItems = null;
  }
  
  return (
    <div className={classes.List}>
      {listItems}
    </div>
  );
}

export default list;
