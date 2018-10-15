import React, { Component } from 'react';
import { Grid, Card, CardContent, Button, CardHeader, Avatar, LinearProgress } from '@material-ui/core';

import { DragDropContainer, DropTarget } from 'react-drag-drop-container';

import './dictator.css';

let dragger = <div className="dictatorDragger"><img src="img/coin.png" alt="" className="resource" /></div>;

export default class Dictator extends Component {

  state = {
    startedAt: Date.now(), //TODO mountedTime
    trialState: "propose-action",
    trial: 0,
    messages: {
      pressNext: 'همهٔ سکه‌ها تقسیم شد. حالا دکمهٔ ادامه را بفشارید.'
    },
    resources: [
      [...Array(this.props.element.resources).keys()], // player 0
      [], // player 1
      []  // player 2
    ]
  }

  updateDimensions = () => {
    console.log('resizing...');
    //styles.root.height = (window.innerHeight-50) + 'px';
  }

  dragListener = e => {
    //console.log('drag is disabled');
    e.preventDefault();
  }

  componentDidMount() {
    window.addEventListener('touchmove', this.dragListener, { passive:false });
    document.addEventListener('touchmove', this.dragListener, { passive:false });
    setTimeout(function(){ window.scrollTo(0, 1); }, 0); // to hide address bar on mobile devices
    window.addEventListener("resize", this.updateDimensions, { passive:false });
  }

  componentWillUnmount() {
    window.removeEventListener('touchmove', this.dragListener);
    document.removeEventListener('touchmove', this.dragListener);

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
    var {resources, trialState} = this.state;

    resources = resources.map(rp => rp.filter(i => i !== data.dragData.resource));

    resources[player].push(data.dragData.resource);

    if (resources[0].length === 0) {
      trialState = "propose-effect"
    }

    this.setState({resources: resources, trialState: trialState}, () => {
      if (this.state.resources[0].length === 0)
        console.log('all resources are shared and state is updated');
    });
  }

  renderPool = (player) => {
    var resources = this.state.resources[player];

    return (
      <div>
      {resources.length>0 && resources.map(r =>
      <DragDropContainer targetKey="resources" key={r} dragData={{resource: r}} customDragElement={dragger}>
        <img src="img/coin.png" alt="" className="resource"/>
      </DragDropContainer>
      )}
      </div>);
  }

  renderSharedPool = trialState => {

    switch(trialState) {
      case "propose-action": 
        return this.renderPool(0);
      case "propose-effect": 
        return <div>
          {this.state.messages.pressNext}
          <br />
          <Button variant="contained" color="secondary" onClick={this.props.onNext}>ادامه</Button>
        </div>;
      default:
      
    }
    return <div></div>;
  }

  render() {
    let {trialState} = this.state;

    return (
      <React.Fragment>
      <LinearProgress color="secondary" variant="determinate" value={40} style={{width: '100%'}}/>

      <Grid container direction="column" justify="space-between" alignItems="stretch" className="dictatorBoard">
        
        <Grid item>
          {this.renderSharedPool(trialState)}
        </Grid>
        
        <Grid item>
          <DropTarget targetKey="resources" onHit={(data) => {this.handleDrop(1, data)}} noDragging={true}>
            <Card>
              <CardHeader 
                title="شقاقل"
                avatar = {<Avatar aria-label="Female" classes={{colorDefault: 'avatar'}}>زن</Avatar>}
                classes = {{avatar: 'dictatorRtlAvatar'}}
                className = "playerCardHeader"
                subheader = "زن، ۱۲ ساله"
                />
              <CardContent className="playerCardContent">
                {this.renderPool(1)}
              </CardContent>
            </Card>
          </DropTarget>
        </Grid>

        <Grid item>
          <DropTarget targetKey="resources" onHit={(data) => {this.handleDrop(2, data)}}>
            <Card>
              <CardHeader 
                title="من"
                avatar = {<Avatar aria-label="Male" classes={{colorDefault: 'avatar'}}>مرد</Avatar>}
                classes = {{avatar: 'dictatorRtlAvatar'}}
                className = "playerCardHeader"
                subheader = "مرد، ۱۳ ساله"
                />
              <CardContent className="playerCardContent">
                {this.renderPool(2)}
              </CardContent>
            </Card>
          </DropTarget>
        </Grid>
              
      </Grid>
      </React.Fragment>
    );
  }
}
