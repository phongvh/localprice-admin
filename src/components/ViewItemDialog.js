import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {grey50, pink500, grey500, indigo500} from 'material-ui/styles/colors';
import IconPlay from 'material-ui/svg-icons/av/volume-up';

import Helper from '../utils/Helper';
import * as firebase from 'firebase';

class ViewItemDialog extends Component {
	constructor(props) {		
    super(props);    
    this.state = {
      expanded: true,
    };
  }

  handleExpandChange = (expanded) => {
    this.setState({expanded: expanded});
  };

  handlePlay = () => {
    const audio = document.getElementById('audioPlay')
    if (audio.paused) {
        audio.play();
    }else{
        audio.pause();
        audio.currentTime = 0
    }
  }

	render() {
		
    const range = (this.props.state.viewItem.price_min && this.props.state.viewItem.price_max)
    ? <div className='rangeArea grey50bg' style={{padding: '0 16px 16px 16px', fontWeight: 500, color: pink500}}> Price may range from {this.props.state.viewItem.price_min} - {this.props.state.viewItem.price_max} {this.props.state.viewItem.currency}/{this.props.state.viewItem.unit}</div>
    : '';

    let placeArray = [];
    let i = 1;
    for(let key in this.props.state.viewItem.place){
      placeArray.push(
        <div key={key} style={{borderTop: '1px solid #eee', padding: 16}}>
          <div style={{fontWeight: 500}}>{this.props.state.viewItem.place[key].name} <span style={{float: 'right', color: indigo500}}>{this.props.state.viewItem.place[key].price}</span></div>
          <div>{this.props.state.viewItem.place[key].address}</div>
          <div>Tel: {this.props.state.viewItem.place[key].tel} - Website: {this.props.state.viewItem.place[key].website}</div>
        </div>
      )
      i++;
    }

		const actions = [
      <FlatButton
        label="Close"
        primary={false}
        onTouchTap={this.props.handleViewItemClose}
        style={{marginRight:8}}
      />,
    ];
		return (
			<div>				
				<Dialog
          modal={false}
          actions={actions}
          open={this.props.state.viewItemOpen}
          autoDetectWindowHeight={false}
          onRequestClose={this.props.handleViewItemClose}
          bodyStyle={{padding: 0}}
          contentStyle={{marginBottom: '100px'}}
          style={{overflow: 'auto'}}
          overlayStyle={{width: '99%'}}
        >
          <Card expanded={this.state.expanded} onExpandChange={this.handleExpandChange}>
            <CardHeader
              title={this.props.state.viewItem.name_en}
              subtitle={<span style={{verticalAlign: 'top'}}>{this.props.state.viewItem.name_loc} <IconPlay style={{cursor: 'pointer'}} onTouchTap={this.handlePlay} /><audio id="audioPlay" src={this.props.state.viewItem.audio} /></span>}  
              showExpandableButton={true}
              titleStyle={{fontSize: 28}}
              subtitleStyle={{lineHeight: '24px'}}
            />

            <CardMedia expandable={true}
              style={{height: 450, backgroundImage: 'url(' + this.props.state.viewItem.image + ')', backgroundSize: 'cover', backgroundPosition: 'center'}}
            />

            <CardTitle
              title={this.props.state.viewItem.price + ' ' + this.props.state.viewItem.currency + '/' + this.props.state.viewItem.unit} 
              subtitle={'Updated at ' + Helper.formatDateTime(this.props.state.viewItem.updated)} 
              titleColor={indigo500} subtitleColor={grey500}
              titleStyle={{fontSize: 20, fontWeight: 500}}
              style={{backgroundColor: grey50}}
            />

            {range}

            <CardText dangerouslySetInnerHTML={{__html: this.props.state.viewItem.information}}
              style={{fontSize: 16, lineHeight: '28px', fontFamily: 'Georgia, serif'}}
            />
            <CardText>
              <h5>Best places to buy</h5>
              {placeArray}
            </CardText>
          </Card>
        </Dialog>
			</div>
		);
	}
}

export default ViewItemDialog;