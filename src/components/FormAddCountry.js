import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import TableCountry from './TableCountry';
import RaisedButton from 'material-ui/RaisedButton';
import {GridList, GridTile} from 'material-ui/GridList';
import * as firebase from 'firebase';

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
      countryName: '',
      countryCode: '',
      errorName: '',
      errorCode: '',
      notValid: true
    }
  }

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

  componentDidUpdate(prevProps, prevState) {
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

  handleSubmit = (event) => {
    if(this.state.countryName && this.state.countryCode){
      let success = false;
      const newCountryRef = firebase.database().ref().child('country').push();
      success = newCountryRef.update({ name: this.state.countryName, country_code: this.state.countryCode, created: firebase.database.ServerValue.TIMESTAMP });
      if(success)
        this.setState({
          countryName: '',
          countryCode: '',
          errorName: '',
          errorCode: '',
          notValid: true
        })
    }else{
      this.setState({
        notValid: true
      })
    }

  };

  render() {
    return (
      <div style={{textAlign: 'left', padding: 20, background: 'white', border: '1px solid #ddd', marginBottom: 10}}>
        <div className='_dark-heading'> Country </div> 
        <div className='row middle-lg'>
          <div className="col-xs-12 col-lg-3 _dark-title">Add new country: </div>
          <div className="col-xs-12 col-lg-3"><TextField name="countryName" value={this.state.countryName} floatingLabelText="Country Name" errorText={this.state.errorName} fullWidth={true} onChange={this.handleChange} /></div>
          <div className="col-xs-12 col-lg-3"><TextField name="countryCode" value={this.state.countryCode} floatingLabelText="Country Code" errorText={this.state.errorCode} fullWidth={true} onChange={this.handleChange} /></div>
        </div>
        <div style={{marginTop: 10, marginBottom: '20px'}}><RaisedButton disabled={this.state.notValid} label="Add Country" primary={true} onTouchTap={this.handleSubmit} /></div>
        <TableCountry />
      </div>
    )
  }
};

export default FormAddCountry;