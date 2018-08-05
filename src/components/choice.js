import React, { Component } from 'react';

import {API} from '../utils/api';
import { RadioGroup, Radio, FormControlLabel, FormControl, FormGroup } from '../../node_modules/@material-ui/core';

const styles = {
  root: {
    display: 'flex',
    minWidth: '100%'
  }
};

export default class Choice extends Component {

  constructor(props) {
    super(props);

    this.state = {
      value: null,
      choices: [
        {value: 1, label: "One"},
        {value: 2, label: "Two"}
      ]
    }
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
          { this.state.choices.map(c =>
            <FormControlLabel key={c.value} value={c.value + ""} control={<Radio />} label={c.label} />
          )}
        </RadioGroup>
      </div>
    );
  }
}
