import React, { Component } from 'react';

import { RadioGroup, Radio, FormControlLabel } from '../../node_modules/@material-ui/core';

export default class Choice extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: undefined
    }
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
      <div>
        <p>{this.props.element.content}</p>
        <br />
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
      </div>
    );
  }
}
