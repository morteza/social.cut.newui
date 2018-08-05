import React, { Component } from 'react';
import { Grid } from '../../node_modules/@material-ui/core';

export default class Statement extends Component {

  constructor(props) {
    super(props);

    this.state = {
      startedAt: 0 //TODO mountedTime
    }
  }

  getResponse = () => {
    return {
      value: 'read',
      startedAt: this.state.startedAt,
      finishedAt: 0 //TODO current time
    };
  }

  render() {
    return (
      <Grid item>
        <div dangerouslySetInnerHTML={{__html: this.props.element.content}}></div>
      </Grid>);
  }
}
