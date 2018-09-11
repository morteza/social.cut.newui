import React, { Component } from 'react';
import { Grid, Card, CardContent, Typography, Button, CardHeader, Avatar, LinearProgress, CardActions } from '@material-ui/core';

import { DragDropContainer, DropTarget } from 'react-drag-drop-container';

import './dictator.css';

export default class TextualDictator extends Component {

  state = {
    startedAt: Date.now(), //TODO mountedTime
    trialState: "propose-action",
    trial: 0,
    trials: this.props.element.trials,
    opponent: this.props.element.personas[Math.floor(Math.random() * this.props.element.personas.length)],
    actions: [],
    me: {
      avatar: "مرد",
      description: "متن تستی",
      age: "۱۳",
      title: "من"
    },
    messages: {
      pressNext: 'همهٔ سکه‌ها تقسیم شد. حالا دکمهٔ ادامه را بفشارید.'
    },
    currentPersona: {},
    resources: [
      [...Array(this.props.element.resources).keys()], // player 0
      [], // player 1
      []  // player 2
    ]
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
      actions: [...this.state.actions, actionToSave]
    }, () => {
      if (trial >= trials) this.props.onNext();
    });


  }

  render() {
    let {trialState, opponent, me, trial, trials} = this.state;
    let progress = 100 * trial/trials;

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
                <Button color="primary" onClick={() => this.nextTrial('opponent')}>۱۰ هزار تومان</Button></Grid>
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
                <Grid item><Button color="primary" onClick={() => this.nextTrial('self')}>۵ هزار تومان</Button></Grid>
                </Grid>
              </CardActions>
            </Card>
        </Grid>
              
      </Grid>
      </React.Fragment>
    );
  }
}
