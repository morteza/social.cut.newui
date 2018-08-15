import React, { Component } from 'react';
import {Grid, CircularProgress, Button, MuiThemeProvider, createMuiTheme } from '@material-ui/core';

import {API} from '../utils/api';

import ChoiceElement from './choice';
import StatementElement from './statement';
import DictatorElement from './dictator/index';

import './experiment.css';
import axios from 'axios';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    padding: 0,
    zIndex: 100
  }
};

export default class Experiment extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
      loaded: undefined,
      code: this.props.location.hash.substring(1),
      content: undefined,
      elements: undefined,
      current: undefined,
      responses: [],
      submitted: undefined,
      ip: undefined,
      email: undefined,
      sessionTrackingCode: undefined,
      direction: 'ltr',
      theme:  createMuiTheme({palette: {}})
    }
  }

  testContent = () => {
    return {
      title: "",
      description:"",
      direction: "rtl",
      study: "",
      elements: [
        {id: 1, type: "choice", content: "جنسیت؟", choices: [{value: "male", label: "پسر"},{value: "female", label: "دختر"}]},
        {id: 2, type: "choice", content: "یک پرسش آزمایشی؟", choices: [{value: "yes", label: "بلی"},{value: "no", label: "خیر"}]},
        {id: 3, type: "dictator", content: "This is a dictator game", resources: 4},
        {id: 4, type: "choice", content: "یک یا دو؟", choices: [{value: "one", label: "یک"},{value: "two", label: "دو"}]}
      ]
    }
  }

  componentDidMount(){

    axios.get('https://jsonip.com/')
      .then(res => {this.setState({ip: res.data.ip})});

    if (this.state.code === 'dictator') {
      var content = this.testContent();
      this.setState({
        content: content, 
        loaded: true, 
        elements: content.elements, 
        current: {...content.elements[0], index: 0},
        direction:  content.direction || 'ltr',
        theme: createMuiTheme({palette: {direction: content.direction}})
      });
        return ;
    }

    //TODO fetch experiment json
    API.get(`/experiments/${this.state.code}/content`)
      .then(res => {
        this.setState({
          content: res.data, 
          loaded: true, 
          elements: res.data.elements,
          current: {...res.data.elements[0], index: 0},
          direction: res.data.direction || 'ltr',
          theme: createMuiTheme({palette: {direction: res.data.direction}})
        });
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

  next = () => {
    var {current, elements} = this.state;
    //store
    
    var elementResponse = this.getElementResponse();
    elementResponse.index = current.index;
    elementResponse.type = current.type;
    elementResponse.id = current.id;

    current.index++;
    if (current.index<elements.length){
      var newElement = this.state.elements[current.index];
      newElement.index = current.index;
      this.setState(
        {responses: [...this.state.responses, elementResponse], current: newElement},
        () => {} //nothing to do (e.g., set loading?)
      );
    } else
      this.setState(
        {responses: [...this.state.responses, elementResponse], current: {type: 'finished'}},
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
    let {loaded, current, direction, theme} = this.state;

    if (loaded === undefined) {
      return (
        <Grid container justify="center" alignItems="center" classes={{container: "loading-grid"}}>
          <br />
          <CircularProgress />
        </Grid>);
    } else if (loaded === false) {
      return <div>Cannot load experiment</div>;
    }

    return (
      <MuiThemeProvider theme={theme}><div dir={direction}>
      <Grid container justify="flex-start" alignItems="center" direction="column" style={styles.root}>
        
        {current && this.renderElement(current, direction)}
        
        { this.isNextButtonVisible(current) &&
        <Grid container justify="center" alignItems="center">
          <Button variant="contained" color="primary" onClick={this.next} size="large">Next</Button>
        </Grid>
        }

      </Grid>
      </div></MuiThemeProvider>
    );
  }

  renderElement = (element, direction) => {

    let {responses, ip} = this.state;
    let typ = undefined;
    if (element && element.type) typ = element.type;

    switch (typ) {
      case 'statement':
        return <StatementElement ref={(el) => {if (el) this.getElementResponse = el.getResponse}} element={element} />;
      case 'choice':
        return <ChoiceElement ref={(el) => {if (el) this.getElementResponse = el.getResponse}} element={element} />;
      case 'dictator':
        return <DictatorElement ref={(el) => {if (el) this.getElementResponse = el.getResponse}} element={element} onNext={this.next} direction={direction}/>;
      case 'finished':
        return (
          <div>
            <p>Finished. Here is what is being submitted:</p>
            <code>{JSON.stringify({ip: ip, responses: responses})}</code>
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
