import React from 'react';
import classes from './Modal.module.css';
import Backdrop from '../Backdrop/Backdrop';

const modal = (props) => (
  <React.Fragment>
    <Backdrop
      addingRestaurantStatus={props.addingRestaurantStatus}
      addingRestaurantHideHandler={props.addingRestaurantHideHandler}
    />
    <div 
      className={classes.Modal}
      style={{
        transform: props.addingRestaurantStatus ? 'translateY(0)' : 'translateY(-100vh)',
        opacity: props.addingRestaurantStatus ? '1' : '0'
      }}
    >
      {props.children}
    </div>
  </React.Fragment>
);

export default modal;
