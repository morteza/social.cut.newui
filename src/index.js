import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from "react-router-dom";
import { Switch } from "react-router";
//import registerServiceWorker from './registerServiceWorker';
import Experiment from './components/experiment';

import './index.css';

export default class CutRouter extends Component {

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
          <Route path="/" component={Experiment} />
        </Switch>
      </BrowserRouter>
    )
  }
}

ReactDOM.render(<CutRouter />, document.getElementById('root'));
//registerServiceWorker();
