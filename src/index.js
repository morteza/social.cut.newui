import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from "react-router-dom";
import { Switch } from "react-router";
//import registerServiceWorker from './registerServiceWorker';
import Experiment from './components/experiment';

export default class CutRouter extends Component {

  render() {
    return (
      <BrowserRouter basename="/">
        <Switch>
          <Route path="/" component={Experiment} />
        </Switch>
      </BrowserRouter>
    )
  }
}

ReactDOM.render(<CutRouter />, document.getElementById('root'));
//registerServiceWorker();
