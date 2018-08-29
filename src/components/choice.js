import React from 'react';

import { RadioGroup, Radio, FormControlLabel, Grid } from '@material-ui/core';

import CutElement from './element';

export default class Choice extends CutElement {

  state = {
    value: undefined,
    styles: {
      root: {
        padding: 20,
        flexGrow: 1
      }
    }
  }

  reset() {
    this.setState({ value: undefined});
  }

  componentWillUnmount() {
    console.log("Unmounting choice element");
  }

  handleChange = event => {
    this.setState({ value: event.target.value });
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
        <RadioGroup
            aria-label={this.props.element.title | "Choices"}
            name="choices"
            value={this.state.value}
            onChange={this.handleChange}
          >
          { this.props.element.choices && this.props.element.choices.map(c =>
            <FormControlLabel key={c.value} value={c.value + ""} control={<Radio />} label={c.label || c.title} />
          )}
        </RadioGroup>
        </Grid>
      </Grid>
    );
  }
}
