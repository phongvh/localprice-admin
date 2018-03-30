import React, { Component, PropTypes } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import Alert from '../components/Alert';
import TableCountry from '../components/TableCountry';
import Helper from '../utils/Helper';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as countryActions from '../actions/countryActions';

import * as firebase from 'firebase';

class CountryContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      country: {name:'', country_code: ''},
      error: {name: '', country_code: ''},
      notValid: true,
      snackOpen: false,
      snackMessage: '',
      isSending: false,
      isSent: false,
      deleteDialogOpen: false,
      deleteKey: ''
    }
    this.timer = undefined;
    this.startTimer = 0;
    this.listener = undefined;
    this.dbRef = firebase.database().ref('country');
  }

  componentDidUpdate(prevProps, prevState) {

    Helper.checkSync(this);

    if(this.state.country.name && this.state.country.country_code && this.state.notValid){
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

  validateForm = (event) => {
    const error = this.state.error;

    const reqField = [
      {name: 'name', message: 'Country Name is required'},
      {name: 'country_code', message: 'Country Code is required'}
    ]

    reqField.forEach((field) => {
      if(event.target.name === field.name) {
        if(event.target.value) {  
          error[field.name] = ''
          this.setState({error})
        }else{
          error[field.name] = field.message
          this.setState({error, notValid: true})
        }
      }
    })
  }

  handleChange = (event) => {
    this.validateForm(event)
    let country = this.state.country;
    country[event.target.name] = event.target.value
    this.setState({
      country
    });
  };

  getCountryById = (countries, countryId) => {
    const country = countries.filter(country => country.id === countryId);
    if (country) return {...country[0]};
    return null;
  }

  handlePreEdit = (countryId) => {
    let country = {name:'', country_code: ''}
    if (countryId && this.props.countries.length > 0) {
      country = this.getCountryById(this.props.countries, countryId);
    }
    this.setState({
      country
    })
    
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

  handleSubmit = () => {
    if(!this.state.notValid){
      this.setState({
              isSending: true,
              isSent: false
            });
      //const newCountryRef = firebase.database().ref().child('country').push();
      //newCountryRef.update({ name: this.state.countryName, country_code: this.state.countryCode, created: firebase.database.ServerValue.TIMESTAMP });
      
      if(this.state.country.id){
        const countryId = this.state.country.id;
        const country = {...this.state.country};

        delete country.id;
        this.dbRef.child(countryId).update({
          ...country,
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
              country: {name:'', country_code: ''},
              error: {name: '', country_code: ''},
              notValid: true,
              snackMessage: 'Country updated!',
              snackOpen: true,
              isSending: false,
              isSent: true
            })
          }
        });
      }else{
        const country = {...this.state.country};
        country.created = firebase.database.ServerValue.TIMESTAMP
        this.dbRef.push(
          country,
          (error) => {
            
            if(error){            
              this.setState({
                snackMessage: 'Failed connecting to server!',
                snackOpen: true,
              });
            }else{
              this.setState({
                country: {name:'', country_code: ''},
                error: {name: '', country_code: ''},
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
    }

  }
  
  render() {
    //debugger;
    return (
      <div style={{textAlign: 'left', padding: 20, background: 'white', border: '1px solid #ddd', marginBottom: 10}}>
        <div className='_dark-heading'> Country </div> 
        <div className='row top-lg'>
          <div className="col-xs-12 col-lg-3 _dark-title"> {this.state.country.id ? 'Edit Country:' : 'Add new country:'} </div>
          <div className="col-xs-12 col-lg-3"><TextField name="name" value={this.state.country.name} floatingLabelText="Country Name" errorText={this.state.error.name} fullWidth={true} onChange={this.handleChange} /></div>
          <div className="col-xs-12 col-lg-3"><TextField name="country_code" value={this.state.country.country_code} floatingLabelText="Country Code" errorText={this.state.error.country_code} fullWidth={true} onChange={this.handleChange} /></div>
        </div>
        <div style={{marginTop: 10, marginBottom: '20px'}}><RaisedButton disabled={this.state.notValid} label={this.state.country.id ? 'Save' : 'Add Country'} primary={true} onTouchTap={this.handleSubmit} /></div>
        <TableCountry tableData={this.props.countries} handleDelete={this.handlePreDelete} handleEdit={this.handlePreEdit} />
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

CountryContainer.propTypes = {
  //tableData: PropTypes.array.isRequired
}

function mapStateToProps(state, ownProps) {
  // debugger;
  return {
    countries: state.countries
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(countryActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CountryContainer);