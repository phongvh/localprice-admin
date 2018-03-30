import React, { Component } from 'react';
import Snackbar from 'material-ui/Snackbar';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import {red400, pink50} from 'material-ui/styles/colors';

class Alert extends Component {
  
  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={false}
        onTouchTap={this.props.handleDialogClose}
        style={{margin:16, marginRight:8}}
      />,
      <RaisedButton
        label="Delete"
        labelColor="white"
        backgroundColor={red400}
        onTouchTap={this.props.handleDelete}
        style={{margin:16, marginLeft:8}}
      />,
    ];
    return (
      <div>        
        <Snackbar
          open={this.props.state.snackOpen}
          message={this.props.state.snackMessage}
          autoHideDuration={3000}
          onRequestClose={this.props.snackClose}          
        />
        <Dialog
          title={this.props.title}
          actions={actions}
          modal={false}
          open={this.props.state.deleteDialogOpen}
          onRequestClose={this.props.handleDialogClose}
          contentStyle={{maxWidth:450}}
          bodyStyle={{backgroundColor:pink50}}
        >
          <p className="red500">This action can not be undone. Becareful!</p>
        </Dialog>
      </div>
    );
  }
}

export default Alert;