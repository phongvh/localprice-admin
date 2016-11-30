import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import AddItemForm from './AddItemForm';
import * as firebase from 'firebase';

class ViewItemDialog extends Component {
	constructor(props) {		
    super(props);    
  }

  componentDidUpdate(prevProps, prevState) {
    //this.item = this.props.state.viewItem;
  }

	render() {
		
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
          actions={actions}
          open={this.props.state.viewItemOpen}
          autoDetectWindowHeight={true}
          onRequestClose={this.props.handleViewItemClose}
          bodyStyle={{padding: 0}}
        >
        	<img src={this.props.state.viewItem.image} width='100%' height='100%' />
          <h3>{this.props.state.viewItem.name_en}</h3>
        </Dialog>
			</div>
		);
	}
}

export default ViewItemDialog;