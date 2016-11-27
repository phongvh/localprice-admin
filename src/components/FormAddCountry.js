import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import TableCountry from './TableCountry';
import RaisedButton from 'material-ui/RaisedButton';
import * as firebase from 'firebase';
import Alert from './Alert';
import Helper from '../utils/Helper';

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
    this.dbRef = firebase.database().ref('country');
  } 

  componentDidMount() {
    this.listener = this.dbRef.on('value' , snap => {
      let tableData = [];
      let itemsList = snap.val();
      Object.keys(itemsList).map((itemKey) => {
        itemsList[itemKey].countryKey = itemKey;
        tableData.push(itemsList[itemKey]);
        return null;
      });
      this.setState({tableData: tableData.reverse()})
    });
  }

  componentWillUnmount() {
    if(typeof this.listener === "object"){
      this.listener.off();
    }
  }

  componentDidUpdate(prevProps, prevState) {

    Helper.checkSync(this);

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
    if(event.target.name === 'countryName') {
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
    }else if(event.target.name === 'countryCode'){
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
        this.dbRef.child(this.state.editKey).update({
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
        this.dbRef.push(
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
    this.dbRef.child(countryKey).once("value", (snap) => {
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
    Helper.deleteItem(this);
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
        <Alert
          title="Delete country" 
          state={this.state} 
          handleDialogClose={this.handleDialogClose}
          handleDelete={this.handleDelete}
          snackClose={this.snackClose}
        />
      </div>
    )
  }
};

export default FormAddCountry;