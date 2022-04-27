import React from 'react';
import classes from './AddRestaurant.module.css';

const addRestaurant = (props) => {
  return(
    <div className={classes.AddRestaurant}>
      <h1>Now you can add a new restaurant</h1>
      <h2>Please fill up fields and click Add</h2>
      <h2>Field marked with * is required</h2>
      <h3>Adding a new restaurant will reset filter criteria</h3>
      <form className={classes.Fields}>
        <div>
          <input type='text' name='name' spellCheck='false' value={props.newRestaurantData.name} onChange={props.newRestaurantDataChangeHandler} required />
          <label>Name *</label>
        </div>
        <div>
          <input type='text' name='phone' spellCheck='false' value={props.newRestaurantData.phone} onChange={props.newRestaurantDataChangeHandler} required />
          <label>Phone</label>
        </div>
        <div>
          <input type='text' name='website' spellCheck='false' value={props.newRestaurantData.website} onChange={props.newRestaurantDataChangeHandler} required />
          <label>Website</label>
        </div>
        <div className={classes.Buttons}>
          <button className={classes.Add} disabled={props.addRestaurantButtonDisabled} onClick={props.addRestaurant}>Add</button>
          <button className={classes.Cancel} onClick={props.cancelAddingRestaurant}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default addRestaurant;
