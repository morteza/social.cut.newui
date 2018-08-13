import React, { Component } from 'react';
import { Grid, Card, CardContent, Typography, Button, CardHeader, Avatar } from '@material-ui/core';

import { DragDropContainer, DropTarget } from 'react-drag-drop-container';

import './experiment.css';

var styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    padding: 20,
    height: '80vh',
    zIndex: 100
  }
};

let dragger = <div className="dictatorDragger"><img src="img/coin.png"/></div>;

export default class Dictator extends Component {

  constructor(props) {
    super(props);

    this.state = {
      startedAt: 0, //TODO mountedTime
      resources: [
        [...Array(this.props.element.resources).keys()], // player 0
        [], // player 1
        []  // player 2
      ]
    }

  }

  updateDimensions = () => {
    console.log('resizing...');
    //styles.root.height = (window.innerHeight-50) + 'px';
  }

  dragListener = e => {
    console.log('drag is disabled');
    e.preventDefault();
  }

  componentDidMount() {
    window.addEventListener('touchmove', this.dragListener);
    document.addEventListener('touchmove', this.dragListener, { passive:false });
    setTimeout(function(){ window.scrollTo(0, 1); }, 0); // to hide address bar on mobile devices
    window.addEventListener("resize", this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('touchmove', this.dragListener);
    document.removeEventListener('touchmove', this.dragListener, { passive:false });

  }

  getResponse = () => {
    return {
      startedAt: this.state.startedAt,
      me: this.state.resources[1].length,
      opponent: this.state.resources[2].length,
      finishedAt: 0 //TODO current time
    };
  }

  handleDrop = (player, data) => {
    let {resources} = this.state;

    resources = resources.map(rp => rp.filter(i => i !== data.dragData.resource));

    resources[player].push(data.dragData.resource);
    this.setState({resources: resources});
  }

  renderPool = (player) => {
    var resources = this.state.resources[player];

    return (
      <div>
      {resources.length>0 && resources.map(r =>
      <DragDropContainer targetKey="resources" key={r} dragData={{resource: r}} zIndex={9999}>
        <img src="img/coin.png" />
      </DragDropContainer>
      )}
      </div>);
  }

  render() {
    return (
      <Grid container direction="column" justify="space-evenly" alignItems="stretch" style={styles.root}>
        
        <Grid item>
          {this.renderPool(0)}
        </Grid>
        
        <Grid item>
          <DropTarget targetKey="resources" onHit={(data) => {this.handleDrop(1, data)}} noDragging={true}>
            <Card>
              <CardHeader 
                title="شقاقل"
                subheader = "۱۲ ساله از تهران"
                avatar = {<Avatar aria-label="Female">زن</Avatar>}
                classes = {{avatar: 'dictatorRtlAvatar'}}
                />
              <CardContent>
                {this.renderPool(1)}
              </CardContent>
            </Card>
          </DropTarget>
        </Grid>

        <Grid item>
          <DropTarget targetKey="resources" onHit={(data) => {this.handleDrop(2, data)}}>
            <Card>
              <CardHeader 
                title="کامبیز"
                subheader = "۱۵ ساله از اهواز"
                avatar = {<Avatar aria-label="Male">مرد</Avatar>}
                classes = {{avatar: 'dictatorRtlAvatar'}}
                />
              <CardContent>
                {this.renderPool(2)}
              </CardContent>
            </Card>
          </DropTarget>
        </Grid>

        <Grid item>
          <Button variant="contained" color="secondary" onClick={this.props.onNext} size="large">TEST NEXT</Button>
        </Grid>
              
      </Grid>
    );
  }
}
