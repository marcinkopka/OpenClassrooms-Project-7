import React from 'react';
import classes from './Backdrop.module.css';

const backdrop = (props) => (
  props.addingRestaurantStatus ? <div className={classes.Backdrop} onClick={props.addingRestaurantHideHandler}></div> : null
);

export default backdrop;
