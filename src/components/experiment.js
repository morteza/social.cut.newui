import React, { Component } from 'react';
import {Grid, CircularProgress, Button } from '@material-ui/core';

import {API} from '../utils/api';

import ChoiceElement from './choice';
import StatementElement from './statement';
import DictatorElement from './dictator';

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

    var code = props.match.params.experimentCode;
    if (!code || code.length===0) code = props.location.hash.substring(1);

    this.state = {
      loaded: undefined,
      code: code,
      content: undefined,
      elements: undefined,
      current: undefined,
      responses: [],
      submitted: undefined,
      ip: undefined,
      email: undefined,
      sessionTrackingCode: undefined
    }
  }

  testContent = () => {
    return {
      title: "",
      description:"",
      study: "",
      elements: [
        {id: 1, type: "choice", content: "This is a test choice", choices: [{value: "Two", label: "Two (2)"},{value: "Four", label: "Four (4)"}]},
        {id: 4, type: "choice", content: "This is a test choice #2", choices: [{value: "Two", label: "Two (2)"},{value: "Four", label: "Four (4)"}]},
        {id: 2, type: "statement", content: "This is a test statement"},
        {id: 3, type: "dictator", content: "This is a dictator game"}
      ]
    }
  }

  componentDidMount(){

    axios.get('https://jsonip.com/')
      .then(res => {this.setState({ip: res.data.ip})});

    if (this.state.code === 'test') {
      var content = this.testContent();
      this.setState({
        content: content, 
        loaded: true, 
        elements: content.elements, 
        current: {...content.elements[0], index: 0}});
        return ;
    }

    //TODO fetch experiment json
    API.get(`/experiments/${this.state.code}/content`)
      .then(res => {
        this.setState({
          content: res.data, 
          loaded: true, 
          elements: res.data.elements, 
          current: {...res.data.elements[0], index: 0}});
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
    let {loaded, current} = this.state;

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
      <Grid container justify="flex-start" alignItems="center" direction="column" style={styles.root}>
        
        {current && this.renderElement(current)}
        
        { this.isNextButtonVisible(current) &&
        <Grid container justify="center" alignItems="center">
          <Button variant="contained" color="primary" onClick={this.next} size="large">Next</Button>
        </Grid>
        }

      </Grid>
    );
  }

  renderElement = element => {

    let {responses, ip} = this.state;
    let typ = undefined;
    if (element && element.type) typ = element.type;

    switch (typ) {
      case 'statement':
        return <StatementElement ref={(el) => {if (el) this.getElementResponse = el.getResponse}} element={element} />;
      case 'choice':
        return <ChoiceElement ref={(el) => {if (el) this.getElementResponse = el.getResponse}} element={element} />;
      case 'dictator':
        return <DictatorElement ref={(el) => {if (el) this.getElementResponse = el.getResponse}} element={element} onNext={this.next}/>;
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
