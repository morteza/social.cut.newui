import React from 'react';
import { Grid } from '@material-ui/core';

import CutElement from './element';

const styles = {
  root: {
    padding: 20,
    flexGrow: 1
  }
};

export default class Statement extends CutElement {

  state = {
    startedAt: 0
  }

  componentDidMount() {
    let t = Date.now();
    this.setState({startedAt: t});
  }

  getResponse = () => {

    let t = Date.now();

    return {
      value: 'read',
      startedAt: this.state.startedAt,
      finishedAt: t
    };
  }

  render() {
    return (
      <Grid container style={styles.root} direction="column">
        <Grid item>
        <div dangerouslySetInnerHTML={{__html: this.props.element.content}}></div>
        </Grid>
      </Grid>
    );
  }
}
