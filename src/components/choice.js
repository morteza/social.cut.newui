import React, { Component } from 'react';

import { RadioGroup, Radio, FormControlLabel, Grid } from '@material-ui/core';

const styles = {
  root: {
    padding: 20,
    flexGrow: 1
  }
};

export default class Choice extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: undefined
    }
  }

  componentWillUnmount() {
    console.log("Unmounting choice element");
  }

  componentWillUpdate() {
    if (this.state.value) this.setState({ value: undefined});
  }

  handleChange = event => {
    this.setState({ value: event.target.value });
  }

  getResponse = () => {
    return {
      value: this.state.value
    };
  }

  render() {
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
