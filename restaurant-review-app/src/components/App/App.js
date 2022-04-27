import React, { Component } from 'react';
import classes from './App.module.css';
import Layout from './Layout/Layout';

class App extends Component {
  render() {
    return (
      <div className={classes.App}>
        <Layout />
      </div>
    );
  }
}

export default App;
