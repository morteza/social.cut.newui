import React from 'react';

import { Grid } from '@material-ui/core';

import Slider from '@material-ui/lab/Slider';

import CutElement from './element';

export default class Likert extends CutElement {

  state = {
    value: undefined,
    styles: {
      root: {
        padding: 20,
        flexGrow: 1
      },
      slider: {
        paddingTop: 20,
        paddingBottom: 20
      }
    }
  }

  handleChange = (event, value) => {
    this.setState({ value });
  }


  reset = () => {
    this.setState({value: undefined});
  }

  getResponse = () => {
    let required = this.props.element.required || false;
    let value = this.state.value;
    if (required && !value) {
      let msg = this.props.messages.required || 'You must answer to proceed.';
      throw new Error(msg);
    }

    this.reset();

    return {
      value: value || null
    };

  }

  render() {
    let {styles} = this.state;
    return (
      <Grid container style={styles.root} direction="column">
        <Grid item>
        <div dangerouslySetInnerHTML={{__html: this.props.element.content}}></div>
        <br />
        </Grid>
        <Grid item>
          <Slider
            style={styles.slider}
            max={this.props.element.max || 5} 
            min={this.props.element.min || 0} 
            step = {1}
            value={this.state.value || Math.floor((this.props.element.min + this.props.element.max)/2)}
            onChange={this.handleChange}
            />
        </Grid>
      </Grid>
    );
  }
}
