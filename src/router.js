import React, { Component } from 'react';
import { BrowserRouter, Route } from "react-router-dom";
import { Switch } from "react-router";

import Experiment from './components/experiment';

export default class DesignerRouter extends Component {

  constructor(props) {
    super(props);
    console.log("setting up routes...");
  }

  routeChangeHandler() {
    alert('changing route');
  }

  render() {
    return (
      <BrowserRouter basename="/" getUserConfirmation={this.routeChangeHandler}>
        <Switch>
          <Route path="/:experimentCode?" component={Experiment} />
        </Switch>
      </BrowserRouter>
    )
  }
}
