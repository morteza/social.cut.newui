import React, { Component } from 'react';
import { Grid, Card, CardContent, Button, CardHeader, Avatar, LinearProgress, CardActions, CircularProgress, Dialog, DialogContentText, DialogTitle, DialogContent, TextField, DialogActions, MenuItem, Select, InputLabel, FormControl, Input, Typography } from '@material-ui/core';
import Slider from '@material-ui/lab/Slider';
import styles from './dictator.css';

export default class TextualDictator extends Component {

  state = {
    startedAt: Date.now(), //TODO mountedTime
    trialState: "waiting-for-new-game",
    trial: 0,
    trials: this.props.element.trials,
    opponent: this.props.element.personas[Math.floor(Math.random() * this.props.element.personas.length)],
    actions: [],
    meShare: 0,
    oponentShare: this.props.element.resources,
    me: undefined,
    meAge: undefined,
    meGender: 'female',
    meDescription: undefined,
    meName: undefined,
    rnd: Math.random
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
      //opponent: this.state.resources[2].length,
      finishedAt: Date.now(), //TODO last click times
      actions: this.state.actions,
      me: this.state.me
    };
  }

  nextTrial = (response = "") => {
    var {trial, trials, meShare, opponentShare} = this.state;
    let newOpponent = this.props.element.personas[Math.floor(Math.random() * this.props.element.personas.length)];
    let actionToSave = {trial: trial, opponent: this.state.opponent, response: response, myShare: meShare, opponentShare: opponentShare};
    
    trial++;
    this.setState({
      rnd: Math.random,
      trial: trial,
      opponent: newOpponent,
      actions: [...this.state.actions, actionToSave],
      trialState: "waiting-for-new-trial"
    }, () => {
      if (trial >= trials) this.props.onNext();
    });


  }

  saveMyProfile =  () => {

    if (!this.state.meName || !this.state.meGender || !this.state.meDescription) {
      alert('برای تصمیم‌گیری بهتر اطلاعات خود را وارد کنیدو هیچ استفاده از آن‌ها نخواهد شد.')
      return;

    }

    this.setState({  me: {
      age: this.state.meAge,
      name: this.state.meName,
      gender: this.state.meGender,
      description: this.state.meDescription,
      share: Math.floor(this.props.element.resources / 2)
    } });
  }

  handleInputChange = (e, field) => {
    this.setState({ [field]: e.target.value });
  };

  handleProposalSliderChange = (e, value) => {
    this.setState({ meShare: value, opponentShare: this.props.element.resources - value});
  }

  renderPlayBoxesRandomly = () => {

    var {trialState, opponent, me, trial} = this.state;
    var { trials, opponentResources, selfResources, trialLoadingTime, initialLoadingTime} = this.props.element;
    let progress = 100 * trial/trials;

    if (this.state.rnd> 0.5) {
      return (
      <React.Fragment>

      <Grid item>
        <Card>
          <CardHeader 
            title={`${me.name} (خودم)`}
            avatar = {<Avatar aria-label="My Avatar" classes={{colorDefault: 'avatar'}}>{me.gender}</Avatar>}
            classes = {{avatar: 'dictatorRtlAvatar'}}
            className = "playerCardHeader"
            subheader = {me.description}
            />
          <CardContent className="playerCardContent">     
          </CardContent>
          <CardActions>
            <Grid container alignItems="center" direction="column">
            <Grid item>{this.state.meShare} سکه</Grid>
            </Grid>
          </CardActions>
        </Card>
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
            <Grid item>{this.state.meShare} سکه</Grid>
            </Grid>
          </CardActions>
        </Card>
      </Grid>
      
      </React.Fragment>);
        
    }


    return (
      <React.Fragment>
      
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
          <Grid item>{this.state.opponentShare} سکه</Grid>
          </Grid>
        </CardActions>
      </Card>
  </Grid>

  <Grid item>
      <Card>
        <CardHeader 
          title={`${me.name} (خودم)`}
          avatar = {<Avatar aria-label="My Avatar" classes={{colorDefault: 'avatar'}}>{me.gender}</Avatar>}
          classes = {{avatar: 'dictatorRtlAvatar'}}
          className = "playerCardHeader"
          subheader = {me.description}
          />
        <CardContent className="playerCardContent">     
        </CardContent>
        <CardActions>
          <Grid container alignItems="center" direction="column">
          <Grid item>{this.state.meShare} سکه</Grid>
          </Grid>
        </CardActions>
      </Card>
  </Grid>
  </React.Fragment>);


  }

  renderAskForProfile = () => {
    return (
      <Dialog 
      classes={{root:styles.TextualDictatorModal}}
      aria-labelledby="profile-title" 
      fullScreen={true}
      open={this.state.me===undefined}>
        <DialogTitle id="profile-title">اطلاعات شما</DialogTitle>

        <DialogContent>
          <DialogContentText>
            لطفاً اطلاعات کلی خود را برای نمایش به بازیکنان دیگر مشخص سازید. سن، جنسیت و یک توصیف یک خطی از خودتان کافی است.
          </DialogContentText>
          <Grid container direction="row" justify="space-between" alignItems="stretch">
            <Grid container direction="row" justify="space-between" alignItems="stretch">
            <FormControl>
          <InputLabel htmlFor="gender">جنسیت</InputLabel>
          <Select
            value={this.state.meGender}
            required
            autoFocus
            onChange={(e) => this.handleInputChange(e, 'meGender')}
            classes={{select:"rtl-full-select-field"}}
            input={<Input id="meGender" name="meGender"/>}>
            <MenuItem value="زن">زن</MenuItem>
            <MenuItem value="مرد">مرد</MenuItem>
          </Select>
        </FormControl>
            <TextField
                    fullWidth
                    required
                    margin="dense"
                    classes={{root:"rtl-text-field"}}
                    onChange={(e) => this.handleInputChange(e, 'meName')}
                    id="name"
                    value={this.state.meName}
                    label="نام"
                    type="text" />
              </Grid>
        <TextField
              fullWidth
              required
              margin="dense"
              classes={{root:"rtl-text-field"}}
              onChange={(e) => this.handleInputChange(e, 'meDescription')}
              id="description"
              label="توصیف یک خطی دربارهٔ خودتان "
              value={this.state.meDescription}
              type="text" />
              </Grid>
          </DialogContent>
          <DialogActions>
          <Button onClick={() => this.saveMyProfile()} color="primary">
            شروع
          </Button>
        </DialogActions>
    </Dialog>);
  }

  render() {
    
    var {trialState, opponent, me, trial} = this.state;
    var { trials, opponentResources, selfResources, trialLoadingTime, initialLoadingTime} = this.props.element;
    let progress = 100 * trial/trials;

    if (me === undefined) {
      return this.renderAskForProfile();
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
        شما باید ۱۰ هزار تومان پول را بین خود و شرکت‌کنندهٔ مقابل تقسیم کنید و با اسلایدر زیر سهم خود را مشخص نموده و بقیه به به شخص مقابل شما تعلق می‌گیرد
            <br /><br />
        جهت اطمینان مقادیر در بخش‌های هر بازیکن نشان داده می‌شود. پس از تایید و نهایی کردن، دکمهٔ پیشنهاد را بفشارید.
        </Grid>
        
        <Grid item className="padded-slider">
        <Typography id="label">سهم شما</Typography>
        <Slider value={this.state.meShare} min={0} max={this.props.element.resources} step={1} onChange={this.handleProposalSliderChange} />
      </Grid>

      <Grid item alignItems="space-around" justify="center">
      <Button color="primary" onClick={() => this.nextTrial('proposed')}>ارائهٔ پیشنهاد</Button>
      </Grid>

        {this.renderPlayBoxesRandomly()}
      </Grid>
      </React.Fragment>
    );
  }
}
