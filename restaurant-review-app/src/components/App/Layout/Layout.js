import React from 'react';
import classes from './Layout.module.css';
import MapContainer from '../../../containers/MapContainer/MapContainer';

const layout = () => {
  return (
    <div className={classes.Layout}>
      <div className={classes.Header}>
        <div className={classes.Title}>
          <h1>Restaurant Review</h1>
        </div>
        <div className={classes.Position}>
          <div className={classes.Marker}>
            <img src='http://maps.google.com/mapfiles/ms/icons/green-dot.png' alt='positionMarker' />
          </div>
          <div className={classes.Description}>
            <h2> - Your position</h2>
          </div>
        </div>
        <div className={classes.Info}>
          <div className={classes.InfoContent}>
            <h2>Right click on a map to add restaurant</h2>
            <h3>To display restaurants with no rating yet use 0 in filter</h3>
          </div>
        </div>
      </div>
      <div className={classes.Main}>
        <MapContainer />
      </div>
    </div>
  );
}

export default layout;
