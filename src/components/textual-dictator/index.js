import React, { Component } from 'react';
import { Grid, Card, CardContent, Typography, Button, CardHeader, Avatar, LinearProgress, CardActions, CircularProgress } from '@material-ui/core';

import './dictator.css';

export default class TextualDictator extends Component {

  state = {
    startedAt: Date.now(), //TODO mountedTime
    trialState: "waiting-for-new-game",
    trial: 0,
    trials: this.props.element.trials,
    opponent: this.props.element.personas[Math.floor(Math.random() * this.props.element.personas.length)],
    actions: [],
    me: {
      avatar: "مرد",
      description: "متن تستی",
      age: "۱۳",
      title: "من"
    }
  }

  updateDimensions = () => {
    console.log('resizing...');
    //styles.root.height = (window.innerHeight-50) + 'px';
  }

  dragListener = e => {
    //console.log('drag is disabled');
    e.preventDefault();
  }

  componentDidMount() {
    window.addEventListener('touchmove', this.dragListener, { passive:false });
    document.addEventListener('touchmove', this.dragListener, { passive:false });
    setTimeout(function(){ window.scrollTo(0, 1); }, 0); // to hide address bar on mobile devices
    window.addEventListener("resize", this.updateDimensions, { passive:false });
  }

  componentWillUnmount() {
    window.removeEventListener('touchmove', this.dragListener);
    document.removeEventListener('touchmove', this.dragListener);

  }

  getResponse = () => {
    return {
      startedAt: this.state.startedAt,
      //me: this.state.resources[1].length,
      //opponent: this.state.resources[2].length,
      finishedAt: Date.now(), //TODO last click time
      actions: this.state.actions
    };
  }

  nextTrial = (response = "") => {
    var {trial, trials} = this.state;
    let newOpponent = this.props.element.personas[Math.floor(Math.random() * this.props.element.personas.length)];
    let actionToSave = {trial: trial, opponent: this.state.opponent, response: response};
    
    trial++;
    this.setState({
      trial: trial,
      opponent: newOpponent,
      actions: [...this.state.actions, actionToSave],
      trialState: "waiting-for-new-trial"
    }, () => {
      if (trial >= trials) this.props.onNext();
    });


  }

  renderAskForProfile = () => {
    /**{
      avatar: "مرد",
      description: "متن تستی",
      age: "۱۳",
      title: "من"
    }, */
    <div>No Profile</div>
  }

  render() {
    var {trialState, opponent, me, trial} = this.state;
    var { trials, opponentResources, selfResources, trialLoadingTime, initialLoadingTime} = this.props.element;
    let progress = 100 * trial/trials;

    if (me === undefined) {
      return this.askForProfile();
    }

    switch(trialState) {
      case "waiting-for-new-game":
        setTimeout(() => {
          this.setState({trialState: undefined});
        }, initialLoadingTime);
        return (
          <Grid container justify="center" alignItems="center" classes={{container: "padded-loading-grid"}}>
            <div>{this.props.element.messages.startingTheGame}</div>
            <br />
            <CircularProgress />
          </Grid>);
      case "waiting-for-new-trial":
        setTimeout(() => {
          this.setState({trialState: undefined});
        }, trialLoadingTime);
        return (
          <Grid container justify="center" alignItems="center" classes={{container: "padded-loading-grid"}}>
            <div>{this.props.element.messages.startingTheTrial}</div>
            <br />
            <CircularProgress />
          </Grid>);
      default:
    }

    //randomized resources
    if (this.props.element.randomizeResources === true) {
      if (Math.random() > 0.5) {
        var tmp = opponentResources;
        opponentResources = selfResources;
        selfResources = tmp;
      }
    }

    return (
      <React.Fragment>
      <LinearProgress color="secondary" variant="determinate" value={progress} style={{width: '100%'}}/>

      <Grid container direction="column" justify="space-between" alignItems="stretch" className="dictatorBoard">
        
        <Grid item>
        شما برای تقسیم مقداری پول باید تصمیم بگیرید. برای تقسیم آن دو انتخاب دارید:
            <br /><ul><li>
         به شرکت کنندهٔ مقابل ۱۰ هزار تومان دهید و خودتان چیزی برندارید.
                 </li><li>
         به شرکت‌کنندهٔ مقابل چیزی ندهید و ۵ هزار تومان برای خودتان بردارید.
        </li>
        </ul>
        </Grid>
        
        <Grid item>
            <Card>
              <CardHeader 
                title={opponent.title}
                avatar = {<Avatar aria-label="Opponent Avatar" classes={{colorDefault: 'avatar'}}>{opponent.avatar}</Avatar>}
                classes = {{avatar: 'dictatorRtlAvatar'}}
                className = "playerCardHeader"
                subheader = {opponent.description}
                />
              <CardContent className="playerCardContent">
              </CardContent>
              <CardActions>
                <Grid container alignItems="center" direction="column">
                <Grid item>
                <Button color="primary" onClick={() => this.nextTrial('opponent')}>{opponentResources}</Button></Grid>
                </Grid>
              </CardActions>
            </Card>
        </Grid>

        <Grid item>
            <Card>
              <CardHeader 
                title={me.title}
                avatar = {<Avatar aria-label="My Avatar" classes={{colorDefault: 'avatar'}}>{me.avatar}</Avatar>}
                classes = {{avatar: 'dictatorRtlAvatar'}}
                className = "playerCardHeader"
                subheader = {me.description}
                />
              <CardContent className="playerCardContent">     
              </CardContent>
              <CardActions>
                <Grid container alignItems="center" direction="column">
                <Grid item><Button color="primary" onClick={() => this.nextTrial('self')}>{selfResources}</Button></Grid>
                </Grid>
              </CardActions>
            </Card>
        </Grid>
              
      </Grid>
      </React.Fragment>
    );
  }
}
