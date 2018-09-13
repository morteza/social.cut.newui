import React from 'react';
import { TextField, Grid, FormControl, InputLabel, Input, MuiThemeProvider } from '@material-ui/core';

import CutElement from './element';

export default class Text extends CutElement {

  state = {
    id: this.props.element.id,
    index: this.props.element.index,
    value: '',
    styles: {
      root: {
        padding: 20,
        flexGrow: 1
      }
    }
  }

  handleChange = event => {
    this.setState({ value: event.target.value });
  }

  reset = () => {
    this.setState({value: ''});
  }

  getResponse = () => {
    let required = this.props.element.required || false;
    let value = this.state.value;
    if (required && (!value || value.trim().length===0)) {
      let msg = this.props.messages.required || 'You must answer to proceed.';
      throw new Error(msg);
    }

    this.reset();

    return {
      value: value
    };
  }

  render() {
    let {styles} = this.state;
    let {element, direction} = this.props;
    return (
      <Grid container style={styles.root} direction="column" alignItems="stretch">
        <Grid item>
          <div dangerouslySetInnerHTML={{__html: element.content}}></div>
          <br />
        </Grid>
        <Grid container alignItems="stretch">
        <TextField
          classes={{root:(direction==="rtl !important")?"rtl-text-field":""}}
          id="value"
          label={element.placeholder || ""}
          value={this.state.value}
          onChange={this.handleChange}
          fullWidth 
          margin="normal"
          helperText={element.help}
        />
        </Grid>
      </Grid>
    );
  }
}
