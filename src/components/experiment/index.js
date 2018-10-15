import React, { Component } from 'react';
import {Grid, CircularProgress, Button, MuiThemeProvider, createMuiTheme, LinearProgress, Dialog, DialogTitle, Snackbar } from '@material-ui/core';

import {API} from '../../utils/api';

import ChoiceElement from '../choice';
import LikertElement from '../likert';
import StatementElement from '../statement';
import DictatorElement from '../dictator';
import TextualDictatorElement from '../textual-dictator';
import TextElement from '../text';

import cookie from 'react-cookies';
import uuid from 'uuid-random';

import demoReflectContent from '../../demos/reflect.json';
import demoDictatorContent from '../../demos/dictator.json';
import devTestContent from '../../demos/test.json';

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
    theme:  createMuiTheme({palette: {}, typography: {useNextVariants: true}})
  }

  componentDidMount(){

    API.getIp().then(res => {this.setState({ip: res.data.ip})});

    if (this.state.code === 'devtest') {
      let theme = createMuiTheme({
        palette: {direction: devTestContent.direction || 'ltr'},
        typography: {
          fontFamily: ['Samim', 'Helvetica Neue', 'Arial', 'Helvetica', 'sans-serif'].join(','),
          useNextVariants: true
        }
      });

      this.setState({
        content: devTestContent, 
        loaded: true, 
        current: {...devTestContent.elements[0], index: 0},
        direction:  devTestContent.direction || 'ltr',
        theme: theme
      });
      return;
    }

    if (this.state.code === 'reflect') {
      let theme = createMuiTheme({
        palette: {direction: demoReflectContent.direction || 'ltr'},
        typography: {
          fontFamily: ['-apple-system', 'Helvetica Neue', 'Arial', 'Helvetica', 'sans-serif'].join(','),
          useNextVariants: true
        }
      });

      this.setState({
        content: demoReflectContent, 
        loaded: true, 
        current: {...demoReflectContent.elements[0], index: 0},
        direction:  demoReflectContent.direction || 'ltr',
        theme: theme
      });
      return;
    }

    if (this.state.code === 'dictator') {
      let theme = createMuiTheme({
        palette: {direction: demoDictatorContent.direction || 'ltr'},
        typography: {
          fontFamily: ['Samim', 'Helvetica Neue', 'Arial', 'Helvetica', 'sans-serif'].join(','),
          useNextVariants: true
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
            fontFamily: ['Samim', 'Helvetica Neue', 'Arial', 'Helvetica', 'sans-serif'].join(','),
            useNextVariants: true
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

  /**
   * Checks if a condition is satisfied based on responses.
   * A condition is an object of {elementId, expectedValue}.
   */
  isConditionSatisfied = (responses, condition) => {
    if (condition && condition.elementId) {
      let satisfied = responses.find(function(elem) {
        if (elem && elem.id === condition.elementId && elem.value === condition.expectedValue) {
          return elem;
        }
        return undefined;
      });

      if (satisfied) 
        return true;
      
      // if there is a condition field and it is not satisfied
      return false;
    }
    // if there is no condition field or it's not a valid field (no elementId)
    return true;
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
      let responses = [...this.state.responses, elementResponse];
      if (!this.isConditionSatisfied(responses, newElement.condition)) {
        current.index++;
        newElement = this.state.content.elements[current.index];
        newElement.index = current.index;
        progress = 100 * current.index / this.state.content.elements.length;
        responses = [...this.state.responses, {id: elementResponse.id, index: elementResponse.index, type: elementResponse.type, skipped: true}];
        // add skip response, and skip this question
        this.setState({progress: progress,responses: responses, current: newElement});
      } else {
        this.setState({progress: progress,responses: responses, current: newElement});
      }
    } else
      this.setState(
        {progress: 100, responses: [...this.state.responses, elementResponse], current: {type: 'finished'}},
        () => {this.finish()}
      );
  }

  finish = () => {
    var randomUUID = uuid();
    var subjectId = cookie.load('cutSubjectId');
    if (!subjectId) {
      subjectId = randomUUID;
      cookie.save('cutSubjectId', subjectId);
    }
    var url = "https://kitten.cut.social/api/v7/sessions/" + this.state.code + "/save/" + subjectId;

    var result = {
      ip: this.state.ip,
      subjectId: subjectId,
      responses: this.state.responses
    }

    API.post(url, result)
      .then(res => {this.setState({sessionTrackingCode: res.data.code})});

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
          <Button variant="contained" color="primary" onClick={this.onNext} size="large">{this.state.content.direction==="rtl"?"ادامه":"Next"}</Button>
        </Grid>
        }

      </Grid>
      </div></MuiThemeProvider>
    );
  }

  renderElement = (element, direction) => {

    let {content} = this.state;
    let typ = undefined;
    if (element && element.type) typ = element.type;

    switch (typ) {
      case 'statement':
        return <StatementElement ref={(el) => {if (el) this.getElementResponse = el.getResponse}} element={element} messages={content.messages} />;
      case 'likert':
        return <LikertElement ref={(el) => {if (el) this.getElementResponse = el.getResponse}} element={element} messages={content.messages} />;
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
          <div dangerouslySetInnerHTML={{__html: content.messages.finished}} style={{padding: '20px'}}></div>
        );
      default:
        return (
          <div>
            <p>Empty Page</p>
          </div>
        );
    }
  }
}
