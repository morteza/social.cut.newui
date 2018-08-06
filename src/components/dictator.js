import React, { Component } from 'react';
import { Grid } from '../../node_modules/@material-ui/core';

import './experiment.css';

export default class Dictator extends Component {

  constructor(props) {
    super(props);

    this.state = {
      startedAt: 0 //TODO mountedTime
    }
  }

  getResponse = () => {
    return {
      value: 'dictator',
      startedAt: this.state.startedAt,
      finishedAt: 0 //TODO current time
    };
  }

  render() {
    return (
      <Grid container direction="column" className="full-height">
        <Grid item>Opponent</Grid>
        <Grid item>Shared</Grid>
        <Grid item>Me</Grid>
      </Grid>
    );
  }
}
