import React, { Component } from 'react';
import {Grid, CircularProgress, Button, MuiThemeProvider, createMuiTheme, LinearProgress, Dialog, DialogContent, DialogTitle, Snackbar } from '@material-ui/core';

import {API} from '../../utils/api';

import ChoiceElement from '../choice';
import StatementElement from '../statement';
import DictatorElement from '../dictator';

import './experiment.css';

let Loading = () => {
    return (<Grid container justify="center" alignItems="center" classes={{container: "loading-grid"}}>
      <br />
      <CircularProgress />
    </Grid>
  )};

let FailedToLoad = () => {
  return (<Dialog
  open={true}
  aria-labelledby="cannot-load-title"
  aria-describedby="alert-dialog-description">
  <DialogTitle id="cannot-load-title">Cannot load the experiment.</DialogTitle>
</Dialog>);
}

export default class Experiment extends Component {

  state = {
    loaded: undefined,
    code: this.props.location.hash.substring(1),
    content: undefined,
    current: undefined,
    responses: [],
    submitted: undefined,
    ip: undefined,
    startedAt: 0,
    timezoneOffset: (new Date()).getTimezoneOffset(),
    email: undefined,
    sessionTrackingCode: undefined,
    direction: 'ltr',
    progress: 0,
    showProgress: true,
    snackMessage: undefined, // if not undefined snackbar will be shown for 5 seconds
    theme:  createMuiTheme({palette: {}})
  }
  
  testContent = () => {
    return {
      title: "",
      description:"",
      direction: "rtl",
      study: "",
      messages: {
        required: "برای ادامه باید به این پرسش پاسخ دهید."
      },
      elements: [
        {id: 1, type: "statement", content: "جنسیت؟"},
        {id: 2, type: "choice", isRequired: true, content: "یک پرسش آزمایشی؟", choices: [{value: "yes", label: "بلی"},{value: "no", label: "خیر"}]},
        {id: 3, type: "dictator", content: "This is a dictator game", resources: 4},
        {id: 4, type: "choice", content: "یک یا دو؟", choices: [{value: "one", label: "یک"},{value: "two", label: "دو"}]}
      ]
    }
  }

  componentDidMount(){

    API.getIp().then(res => {this.setState({ip: res.data.ip})});

    if (this.state.code === 'dictator') {
      var content = this.testContent();

      let theme = createMuiTheme({
        palette: {direction: content.direction || 'ltr'},
        typography: {
          fontFamily: ['Samim', 'Helvetica Neue', 'Arial', 'Helvetica', 'sans-serif'].join(',')
        }
      });

      this.setState({
        content: content, 
        loaded: true, 
        current: {...content.elements[0], index: 0},
        direction:  content.direction || 'ltr',
        theme: theme
      });
      return;
    }

    API.getExperimentContent(this.state.code)
      .then(res => {

        let theme = createMuiTheme({
          palette: {direction: res.data.direction || 'ltr'},
          typography: {
            fontFamily: ['Samim', 'Helvetica Neue', 'Arial', 'Helvetica', 'sans-serif'].join(',')
          }
        });

        this.setState({
          content: res.data, 
          loaded: true, 
          current: {...res.data.elements[0], index: 0},
          direction: res.data.direction || 'ltr',
          theme: theme,
          progress: 0,
          startedAt: Date.now()
        });
      })
      .catch(error => {
        this.setState({loaded: false});
      }); 
  }

  isNextButtonVisible = element => {
    let typ = undefined;
    if (element && element.type) typ = element.type;

    let interactiveElements = ['ultimatum', 'dictator', 'gonogo', 'temporal-discounting', 'bart', 'finished'];

    if (interactiveElements.includes(typ)) 
      return false;
    return true;
  }


  preventIfRequired = (element, response) => {
    let isRequired = element.isRequired || false;
    let value = response.value;
    if (isRequired && !value) {
      //show snack
      let message = this.state.content.messages.required || 'You must answer to proceed.';
      this.setState({snackMessage: message})
      return true;
    }
    return false;
  }

  hideSnack = () => {
    this.setState({snackMessage: undefined});
  }

  renderSnack = () => {
    let direction = this.state.content.direction || "ltr";
    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: direction==="rtl"?'right':'left',
        }}
        open={this.state.snackMessage !== undefined}
        autoHideDuration={5000}
        onClose = {this.hideSnack}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={<span id="message-id">{this.state.snackMessage}</span>}/>
    );
  }

  onNext = () => {
    var {current, content} = this.state;
    //store
    
    var elementResponse = this.getElementResponse();

    if (this.preventIfRequired(current, elementResponse))
      return;

    elementResponse.index = current.index;
    elementResponse.type = current.type;
    elementResponse.id = current.id;

    current.index++;
    if (current.index<content.elements.length){
      var newElement = this.state.content.elements[current.index];
      newElement.index = current.index;
      let progress = 100 * current.index / this.state.content.elements.length;
      this.setState(
        {progress: progress,responses: [...this.state.responses, elementResponse], current: newElement},
        () => {} //nothing to do (e.g., set loading?)
      );
    } else
      this.setState(
        {progress: 100, responses: [...this.state.responses, elementResponse], current: {type: 'finished'}},
        () => {this.finish()}
      );
  }

  finish = () => {
    var subjectId = "037eb7bb-c883-40df-bab5-2537cd1e06bf";
    var url = "https://kitten.cut.social/api/v7/sessions/" + this.state.code + "/save/" + subjectId;

    var result = {
      ip: this.state.ip,
      responses: this.state.responses
    }

    API.post(url, result)
      .then(res => {this.setState({sessionTrackingCode: res.data.code})});

    console.log("RESPONSE: ", this.state.responses)
  }

  render() {
    let {loaded, current, direction, showProgress, theme} = this.state;

    if (loaded === undefined) 
      return <Loading />;
    else if (loaded === false) {
      return <FailedToLoad />;
    }

    return (
      <MuiThemeProvider theme={theme}><div dir={direction}>
      {showProgress &&
        <LinearProgress variant="determinate" value={this.state.progress} />
      }
      {this.state.snackMessage && 
        this.renderSnack()
      }
      <Grid container justify="flex-start" alignItems="center" direction="column">
        
        {current && this.renderElement(current, direction)}
        
        { this.isNextButtonVisible(current) &&
        <Grid container justify="center" alignItems="center">
          <Button variant="contained" color="primary" onClick={this.onNext} size="large">Next</Button>
        </Grid>
        }

      </Grid>
      </div></MuiThemeProvider>
    );
  }

  renderElement = (element, direction) => {

    let {responses, ip, timezoneOffset} = this.state;
    let typ = undefined;
    if (element && element.type) typ = element.type;

    switch (typ) {
      case 'statement':
        return <StatementElement ref={(el) => {if (el) this.getElementResponse = el.getResponse}} element={element} />;
      case 'choice':
        return <ChoiceElement ref={(el) => {if (el) this.getElementResponse = el.getResponse}} element={element} />;
      case 'dictator':
        return <DictatorElement ref={(el) => {if (el) this.getElementResponse = el.getResponse}} element={element} onNext={this.onNext} direction={direction} />;
      case 'finished':
        return (
          <div>
            <p>Finished. Here is what is being submitted:</p>
            <code>{JSON.stringify({ip: ip, timezoneOffset: timezoneOffset, responses: responses})}</code>
          </div>);
      default:
        return (
          <div>
            <p>UNKNOWN ELEMENT</p>
          </div>
        );
    }
  }
}
