import React, { Component } from 'react';
import { Grid, Card, CardContent, Typography, Button, CardHeader, Avatar } from '@material-ui/core';

import './experiment.css';

var styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    padding: 20,
    height: '80vh',
    zIndex: 100
  }
};

export default class Dictator extends Component {

  constructor(props) {
    super(props);

    this.state = {
      startedAt: 0 //TODO mountedTime
    }
  }

  updateDimensions = () => {
    console.log('resizing...');
    styles.root.height = (window.innerHeight-50) + 'px';
  }

  dragListener = e => {
    console.log('drag is disabled');
    e.preventDefault();
  }

  componentDidMount() {
    window.addEventListener('touchmove', this.dragListener);
    document.addEventListener('touchmove', this.dragListener, { passive:false });
    setTimeout(function(){ window.scrollTo(0, 1); }, 0); // to hide address bar on mobile devices
    window.addEventListener("resize", this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('touchmove', this.dragListener);
    document.removeEventListener('touchmove', this.dragListener, { passive:false });

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
      <Grid container direction="column" justify="space-evenly" alignItems="stretch" style={styles.root}>
        <Grid item>
          <Card>
            <CardHeader 
              title="کامبیز"
              subheader = "۱۵ ساله از اهواز"
              avatar = {<Avatar aria-label="Male">مرد</Avatar>}
              classes = {{avatar: 'dictatorRtlAvatar'}}
              />
            <CardContent>
              <Typography>
                Resources
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
            <CardHeader 
              title="شقاقل"
              subheader = "۱۲ ساله از تهران"
              avatar = {<Avatar aria-label="Female">زن</Avatar>}
              classes = {{avatar: 'dictatorRtlAvatar'}}
              />
            <CardContent>
              <Typography>
                Me
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Button variant="contained" color="secondary" onClick={this.props.onNext} size="large">TEST next</Button>
      </Grid>
    );
  }
}
