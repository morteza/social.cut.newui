import React, { Component } from 'react';
import { Grid, Card, Button, CardHeader, Avatar, LinearProgress, CardActions, CircularProgress, Dialog, DialogContentText, DialogTitle, DialogContent, TextField, DialogActions, MenuItem, Select, InputLabel, FormControl, Input, Typography } from '@material-ui/core';
import styles from './random-allocation.css';

export default class RandomAllocation extends Component {

  state = {
    startedAt: Date.now(), //TODO change to the time component mounted
    trial: 0
  }

  getResponse = () => {
    return {
      startedAt: this.state.startedAt,
      //opponent: this.state.resources[2].length,
      finishedAt: Date.now(), //TODO last click times
    };
  }

  renderAskForProfile = () => {}

  renderIntroToGame = () => {}

  renderWaitingForOpponent = () => {}

  render() {

  }
}
