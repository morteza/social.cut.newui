import React, { Component } from 'react';
import {Grid, CircularProgress, Button } from '@material-ui/core';

import {API} from '../utils/api';

import ChoiceElement from './choice';
import StatementElement from './statement';

import './experiment.css';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 20,
    zIndex: 100
  }
};

export default class Experiment extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loaded: undefined,
      code: props.match.params.experimentCode,
      content: undefined,
      elements: undefined,
      current: undefined,
      responses: [],
      submitted: undefined
    }
  }

  componentDidMount(){

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
    let typ = undefined;
    if (element && element.type) typ = element.type;

    switch (typ) {
      case 'statement':
        return <StatementElement ref={(el) => {if (el) this.getElementResponse = el.getResponse}} element={element} />;
      case 'choice':
        return <ChoiceElement ref={(el) => {if (el) this.getElementResponse = el.getResponse}} element={element} />;
      case 'finished':
        return (
          <div>
            <p>Finished. Here is what is being submitted:</p>
            <code>{JSON.stringify(this.state.responses)}</code>
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
