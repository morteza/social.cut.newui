import React, { Component } from 'react';
import {Grid, CircularProgress, Button, MuiThemeProvider, createMuiTheme, LinearProgress, Dialog, DialogContent, DialogTitle, Snackbar } from '@material-ui/core';

import {API} from '../../utils/api';

import ChoiceElement from '../choice';
import StatementElement from '../statement';
import DictatorElement from '../dictator';
import TextualDictatorElement from '../textual-dictator';
import TextElement from '../text';

import demoDictatorContent from '../../demos/dictator.json';

import './experiment.css';

function NotificationBar(props) {
  let {message, direction, onHide} = props;
  direction = direction || "ltr";
  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: direction==="rtl"?'right':'left',
      }}
      open={message !== undefined}
      autoHideDuration={5000}
      onClose = {onHide}
      ContentProps={{
        'aria-describedby': 'message-id',
      }}
      message={<span id="message-id">{message}</span>}/>
  );
}

function Loading(loaded = undefined) {

  // Still loading
  if (loaded === undefined)
    return (
      <Grid container justify="center" alignItems="center" classes={{container: "loading-grid"}}>
        <br />
        <CircularProgress />
      </Grid>
    );

  // Failed to load
  if (loaded === false) 
    return (
      <Dialog
        open={true}
        aria-labelledby="cannot-load-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="cannot-load-title">Cannot load the experiment.</DialogTitle>
      </Dialog>
    );

  return null;
};

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
    notification: undefined, // if not undefined notification bar will be shown for 5 seconds
    theme:  createMuiTheme({palette: {}})
  }

  componentDidMount(){

    API.getIp().then(res => {this.setState({ip: res.data.ip})});

    if (this.state.code === 'dictator') {
      let theme = createMuiTheme({
        palette: {direction: demoDictatorContent.direction || 'ltr'},
        typography: {
          fontFamily: ['Samim', 'Helvetica Neue', 'Arial', 'Helvetica', 'sans-serif'].join(',')
        }
      });

      this.setState({
        content: demoDictatorContent, 
        loaded: true, 
        current: {...demoDictatorContent.elements[0], index: 0},
        direction:  demoDictatorContent.direction || 'ltr',
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

    let interactiveElements = ['ultimatum', 'textual-dictator', 'dictator', 'gonogo', 'temporal-discounting', 'bart', 'finished'];

    if (interactiveElements.includes(typ)) 
      return false;
    return true;
  }

  hideNotification = () => {
    this.setState({notification: undefined});
  }

  onNext = () => {
    var {current, content} = this.state;
    //store
    
    var elementResponse;
    try {
      elementResponse = this.getElementResponse();
    } catch (err) {
      this.setState({notification: err.message});
      return;
    }


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
    //TODO create random subjectId or read from cookie
    var subjectId = "037eb7bb-c883-40df-bab5-2537cd1e06bf";
    var url = "https://kitten.cut.social/api/v7/sessions/" + this.state.code + "/save/" + subjectId;

    var result = {
      ip: this.state.ip,
      subjectId: subjectId,
      responses: this.state.responses
    }

    API.post(url, result)
      .then(res => {this.setState({sessionTrackingCode: res.data.code})});

    console.log("FINISHED AND SUBMITTED");
  }

  render() {
    let {loaded, current, direction, showProgress, theme} = this.state;

    if (!loaded) 
      return <Loading />;

    return (
      <MuiThemeProvider theme={theme}><div dir={direction}>
      {showProgress &&
        <LinearProgress variant="determinate" value={this.state.progress} />
      }
      {this.state.notification && 
        <NotificationBar 
          message={this.state.notification} 
          direction={this.state.content.direction} 
          onHide={this.hideNotification} />
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

    let {responses, ip, timezoneOffset, content} = this.state;
    let typ = undefined;
    if (element && element.type) typ = element.type;

    switch (typ) {
      case 'statement':
        return <StatementElement ref={(el) => {if (el) this.getElementResponse = el.getResponse}} element={element} messages={content.messages} />;
      case 'choice':
        return <ChoiceElement ref={(el) => {if (el) this.getElementResponse = el.getResponse}} element={element} messages={content.messages} />;
      case 'textual-dictator':
        return <TextualDictatorElement ref={(el) => {if (el) this.getElementResponse = el.getResponse}} element={element} onNext={this.onNext} direction={direction} messages={content.messages} />;
      case 'dictator':
        return <DictatorElement ref={(el) => {if (el) this.getElementResponse = el.getResponse}} element={element} onNext={this.onNext} direction={direction} messages={content.messages} />;
      case 'text':
        return <TextElement ref={(el) => {if (el) this.getElementResponse = el.getResponse}} element={element} direction={direction} messages={content.messages} />;
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
