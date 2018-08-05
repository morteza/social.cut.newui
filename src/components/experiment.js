import React, { Component } from 'react';
import {Grid, CircularProgress, Button } from '@material-ui/core';

import {API} from '../utils/api';

import ChoiceElement from './choice';

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
      currentIndex: 0,
      responses: []
    }
  }

  componentDidMount(){

    //TODO fetch experiment json
    API.get(`/experiments/${this.state.code}/content`)
      .then(res => {
        console.log("DATA", res.data);
        this.setState({content: res.data, loaded: true});
        this.setState({elements: res.data.elements});
        this.setState({current: {...res.data.elements[0], index: 0}});
      });
  }

  isNextButtonVisible = (elementType) => {
    if (elementType === 'choice') {
      return true;
    }
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
        {responses: [...this.state.responses, elementResponse], current: undefined},
        () => {this.finish()}
      );
  }

  finish = () => {
    console.log("RESPONSE: ", this.state.responses)
  }

  render() {
    let {loaded, current, responses} = this.state;

    if (loaded === undefined) {
      return (
        <Grid container justify="center" alignItems="center" classes={{container: "loading-grid"}}>
          <br />
          <CircularProgress />
        </Grid>);
    } else if (loaded === false) {
      //TODO failed to load
      return (<div>Cannot load experiment</div>);
    }

    return (
      <div style={styles.root}>
        <Grid container justify="flex-start" alignItems="center" direction="column">
        {current && this.renderElement(current)}
        {current === undefined &&
            <div>
              <p>Finished :D</p>
              <code>{JSON.stringify(responses)}</code>
            </div>
        }
        </Grid>
      </div>
    );
  }

  renderElement = element => {
    let typ = element.type;
    return (
      <div className="element-container">
      { typ === 'statement' &&
        <Grid item>
          <div dangerouslySetInnerHTML={{__html:element.content}}></div>
        </Grid>
      }
      { typ === 'choice' && 
        <Grid item>
          <ChoiceElement ref={(el) => {if (el) this.getElementResponse = el.getResponse}} element={element} />
        </Grid>
      }
      { this.isNextButtonVisible(typ) &&
        <Grid container justify="center" alignItems="center">
          <Button variant="contained" color="primary" onClick={this.next} size="large">Next</Button>
        </Grid>
      }
    </div>
    );
  }
}
