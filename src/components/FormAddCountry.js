import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import TableCountry from './TableCountry';
import RaisedButton from 'material-ui/RaisedButton';
import * as firebase from 'firebase';
import Snackbar from 'material-ui/Snackbar';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {red400, pink50} from 'material-ui/styles/colors';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    display: 'flex',
    flexWrap: 'nowrap'
  },
  titleStyle: {
    color: 'rgb(0, 188, 212)',
  },
};

class FormAddCountry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: [],
      countryName: '',
      countryCode: '',
      errorName: '',
      errorCode: '',
      notValid: true,
      snackOpen: false,
      snackMessage: '',
      isSending: false,
      isSent: false,
      deleteDialogOpen: false,
      deleteKey: '',
      editMode: false,
      editKey: ''
    }
    this.timer = undefined;
    this.startTimer = 0;
    this.listener = undefined;
  } 

  componentDidMount() {
    const countryRef = firebase.database().ref().child('country');
    this.listener = countryRef.on('value' , snap => {
      let tableData = [];
      let itemsList = snap.val();
      Object.keys(itemsList).map((itemKey) => {
        itemsList[itemKey].countryKey = itemKey;
        tableData.push(itemsList[itemKey]);
      });
      this.setState({tableData: tableData.reverse()})
    });
  }

  componentWillUnmount() {
    if(typeof this.listener == "object"){
      this.listener.off();
    }
  }

  componentDidUpdate(prevProps, prevState) {

    const sendingCheck = () => {
      this.timer = setTimeout(() => {        
        console.log("Check sending...");
        if((Date.now() - this.startTimer) > 8000){
          this.setState({
              snackMessage: 'Failed connecting to server! Reloading this page...',
              snackOpen: true,
            });
        }
        if((Date.now() - this.startTimer) > 10000){
          this.startTimer = 0;
          clearTimeout(this.timer);
          if(typeof this.listener == "object"){
            this.listener.off();
          }
          location.reload();
        }else{
          sendingCheck();
        }
      }, 1500);
    }

    if(this.state.isSent){
      this.setState({
          isSent: false,
        });
      console.log("timer cleared");      
      this.startTimer = 0;
      clearTimeout(this.timer);
    }

    if(this.state.isSending){
      if(!this.startTimer){
        this.startTimer = Date.now();
        sendingCheck(); 
      }    
    }  
    
    if(this.state.slackOpen){
      this.setState({
          snackOpen: false,
          snackMessage: ''
        });
    }
    if(this.state.countryName && this.state.countryCode && this.state.notValid){      
      this.setState({
          notValid: false
        });
    }    
    
  }
/*
  handleBlur = (event) => {
    if(event.target.name == 'countryName') {
      if(event.target.value)
        this.setState({
          countryName: event.target.value
        });
    }else if(event.target.name == 'countryCode') {
      if(event.target.value)
        this.setState({
          countryCode: event.target.value
        });      
    }
  }*/

  handleChange = (event) => {
    if(event.target.name == 'countryName') {
      if(event.target.value)
        this.setState({
          countryName: event.target.value,
          errorName: ''
        });
      else {

        this.setState({
          countryName: '',
          errorName: 'Country Name is required',
          notValid: true
        });
      }
    }else if(event.target.name == 'countryCode'){
      if(event.target.value)
        this.setState({
          countryCode: event.target.value,
          errorCode: ''
        });
      else 
        this.setState({
          countryCode: '',
          errorCode: 'Country code is required',
          notValid: true
        });
    }    
  };

  handleSubmit = () => {
    if(this.state.countryName && this.state.countryCode){
      this.setState({
              isSending: true,
              isSent: false
            });
      //const newCountryRef = firebase.database().ref().child('country').push();
      //newCountryRef.update({ name: this.state.countryName, country_code: this.state.countryCode, created: firebase.database.ServerValue.TIMESTAMP });
      
      if(this.state.editMode){
        firebase.database().ref().child('country').child(this.state.editKey).update({
          name: this.state.countryName,
          country_code: this.state.countryCode,
          updated: firebase.database.ServerValue.TIMESTAMP
        },
        (error) => {
            
          if(error){            
            this.setState({
              snackMessage: 'Failed connecting to server!',
              snackOpen: true,
            });
          }else{
            this.setState({
              countryName: '',
              countryCode: '',
              errorName: '',
              errorCode: '',
              notValid: true,
              snackMessage: 'Country updated!',
              snackOpen: true,
              isSending: false,
              isSent: true,
              editMode: false,
              editKey: ''
            })
          }
        });
      }else{
        firebase.database().ref().child('country').push(
          { 
            name: this.state.countryName, 
            country_code: this.state.countryCode, 
            created: firebase.database.ServerValue.TIMESTAMP 
          },
          (error) => {
            
            if(error){            
              this.setState({
                snackMessage: 'Failed connecting to server!',
                snackOpen: true,
              });
            }else{
              console.log("run");
              this.setState({
                countryName: '',
                countryCode: '',
                errorName: '',
                errorCode: '',
                notValid: true,
                snackMessage: 'New country added!',
                snackOpen: true,
                isSending: false,
                isSent: true
              })
            }
          }
        );
      }  
    }else{
      this.setState({
        notValid: true
      })
    }

  };

  handlePreEdit = (countryKey) => {
    firebase.database().ref().child('country').child(countryKey).once("value", (snap) => {
      const country = snap.val()
      this.setState({
        countryName: country.name,
        countryCode: country.country_code,
        editMode: true,
        editKey: countryKey
      })
    });
    
  }

  handlePreDelete = (countryKey) => {
    this.setState({
        deleteDialogOpen: true,
        deleteKey: countryKey
      })
  }

  handleDelete = () => {
    if(this.state.deleteKey)
      firebase.database().ref().child('country').child(this.state.deleteKey).remove().then((function() {
        this.setState({
          snackMessage: 'Delete succeeded',
          snackOpen: true
        })
      }).bind(this))
      .catch((function(error) {
        this.setState({
          snackMessage: "Remove failed: " + error.message,
          snackOpen: true
        })
      }).bind(this));

    this.setState({
      deleteDialogOpen: false,
      deleteKey: ''
    })
  };

  handleDialogClose = () => {
    this.setState({
          deleteDialogOpen: false,
          deleteKey: ''
        })
  };

  snackClose = (reason) => {
    this.setState({
            snackMessage: '',
            snackOpen: false,
          });
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={false}
        onTouchTap={this.handleDialogClose}
        style={{margin:16, marginRight:8}}
      />,
      <RaisedButton
        label="Delete"
        labelColor="white"
        backgroundColor={red400}
        onTouchTap={this.handleDelete}
        style={{margin:16, marginLeft:8}}
      />,
    ];

    return (
      <div style={{textAlign: 'left', padding: 20, background: 'white', border: '1px solid #ddd', marginBottom: 10}}>
        <div className='_dark-heading'> Country </div> 
        <div className='row top-lg'>
          <div className="col-xs-12 col-lg-3 _dark-title"> {this.state.editMode ? 'Edit Country:' : 'Add new country:'} </div>
          <div className="col-xs-12 col-lg-3"><TextField name="countryName" value={this.state.countryName} floatingLabelText="Country Name" errorText={this.state.errorName} fullWidth={true} onChange={this.handleChange} /></div>
          <div className="col-xs-12 col-lg-3"><TextField name="countryCode" value={this.state.countryCode} floatingLabelText="Country Code" errorText={this.state.errorCode} fullWidth={true} onChange={this.handleChange} /></div>
        </div>
        <div style={{marginTop: 10, marginBottom: '20px'}}><RaisedButton disabled={this.state.notValid} label={this.state.editMode ? 'Save' : 'Add Country'} primary={true} onTouchTap={this.handleSubmit} /></div>
        <TableCountry tableData={this.state.tableData} handleDelete={this.handlePreDelete} handleEdit={this.handlePreEdit} />
        <Snackbar
          open={this.state.snackOpen}
          message={this.state.snackMessage}
          autoHideDuration={30000}
          onRequestClose={this.snackClose}          
        />
        <Dialog
          title="Delete country"
          actions={actions}
          modal={false}
          open={this.state.deleteDialogOpen}
          onRequestClose={this.handleDialogClose}
          contentStyle={{maxWidth:450}}
          bodyStyle={{backgroundColor:pink50}}
        >
          <p className="red500">This action can not be undone. Becareful!</p>
        </Dialog>
      </div>
    )
  }
};

export default FormAddCountry;