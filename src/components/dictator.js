import React, { Component } from 'react';
import { Grid, Card, CardContent, Typography, Button } from '@material-ui/core';

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
      <Grid container direction="column" className="full-height" justify="space-evenly" alignItems="stretch">
        <Grid item>
          <Card>
            <CardContent>
              <Typography>
                Opponent
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item>
          <Card>
            <CardContent>
              :-)
            </CardContent>
          </Card>
        </Grid>
        <Grid item>
          <Card>
            <CardContent>
              <Typography>
                Me
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Button variant="contained" color="secondary" onClick={this.props.onNext} size="large">Next</Button>
      </Grid>
    );
  }
}
