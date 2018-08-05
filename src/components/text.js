import React, { Component } from 'react';

export default class Text extends Component {

  constructor(props) {
    super(props);

    this.state = {
      id: props.element.id,
      index: props.element.index,
      value: null
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
      </div>
    );
  }
}
