import React from 'react';
import classes from './Filter.module.css';

const filter = (props) => {
  return (
    <div className={classes.Filter}>
      <div className={classes.Title}>
        <p>Display restaurants</p>
      </div>
      <div className={classes.Min}>
        <div className={classes.Label}>Min</div>
        <button className={classes.Less} disabled={props.filterButtonsDisabled.minLess} onClick={props.updateFiltersHandler} id="minLess">Less</button>
        <div className={classes.Value}>{props.filterData.filterMin}</div>
        <button className={classes.More} disabled={props.filterButtonsDisabled.minMore} onClick={props.updateFiltersHandler} id="minMore">More</button>
        <div className={classes.Star}></div>
      </div>
      <div className={classes.Max}>
        <div className={classes.Label}>Max</div>
        <button className={classes.Less} disabled={props.filterButtonsDisabled.maxLess} onClick={props.updateFiltersHandler} id="maxLess">Less</button>
        <div className={classes.Value}>{props.filterData.filterMax}</div>
        <button className={classes.More} disabled={props.filterButtonsDisabled.maxMore} onClick={props.updateFiltersHandler} id="maxMore">More</button>
        <div className={classes.Star}></div>
      </div>
      <div className={classes.Apply}>
        <button onClick={props.resetFilter}>Reset filter</button>
      </div>
    </div>
  );
}

export default filter;
