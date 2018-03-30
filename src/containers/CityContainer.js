import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

import Alert from '../components/Alert';
import TableCity from '../components/TableCity';
import Helper from '../utils/Helper';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as cityActions from '../actions/cityActions';

import * as firebase from 'firebase';

class CityContainer extends Component {
  constructor(props) {
    super(props);
    
    //const defaultCountry = props.countries.length ? props.countries[0].id : '';

    this.state = {
      city: {name: '', country_id: '', image: '', image_path: '', currency: ''},
      error: {name: '', currency: ''},
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
    //this.cityListener = undefined;
    //this.defaultCountry = props.countries[0].id;
    this.fileStorage = firebase.storage().ref('city');
    this.dbRef = firebase.database().ref('city');
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.countries !== nextProps.countries) {      
      this.setState({city: {...this.state.city, country_id: nextProps.countries[0].id}});
    }
    /*if (this.props.cities !== nextProps.cities) {      
      this.setState({cities: [...nextProps.cities]});
    }*/
  }

  componentDidMount() {
    /*
    if(this.props.cities.length === 0){
      console.log("runloading")
      Helper.showLoading();
      this.props.actions.loadCities();
    }*/
    /*this.cityListener = this.dbRef.on('value' , snap => {
      let tableData = [];
      let itemsList = snap.val();
      Object.keys(itemsList).map((itemKey) => {
        itemsList[itemKey].cityKey = itemKey;
        tableData.push(itemsList[itemKey]);
        return null;
      });
      this.setState({tableData: tableData.reverse()})
      Helper.hideLoading();
    });*/
  }

  /*componentWillUnmount() {
    if(typeof this.countryListener === "object"){
      this.countryListener.off();
    }
    if(typeof this.cityListener === "object"){
      this.cityListener.off();
    }
  }*/

  componentDidUpdate(prevProps, prevState) {
    
    Helper.checkSync(this);
    
    if(this.state.city.name && this.state.city.currency && this.state.city.image && this.state.city.country_id && this.state.notValid){      
      this.setState({
          notValid: false
        });
    }    
    
  }

  validateForm = (event) => {
    const error = this.state.error;

    const reqField = [
      {name: 'name', message: 'City Name is required'},
      {name: 'currency', message: 'Currency is required'}
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
    let city = this.state.city    

    if(event.target.name === 'image'){
      let file = event.target.files[0];
      if(file.type.toLowerCase() !== 'image/png' && file.type.toLowerCase() !== 'image/jpeg'){
        alert('Error: A png or jpeg file is required');
        event.target.value = null;
        return false;
      }
      let fileRef = this.fileStorage.child(file.name);
      let task = fileRef.put(file).then((snap) => {
        document.getElementById("imagePreview").innerHTML = "<img src='" + snap.downloadURL + "' width='40' height='40' />";
        this.setState({city: {...city, image: snap.downloadURL, image_path: snap.metadata.fullPath}});
      });
    }else{
      city[event.target.name] = event.target.value
      this.setState({
        city
      });
    }
  }

  handleCountryChange = (event, index, value) => {
    console.log(event.name, index, value)
    this.setState({city: {...this.state.city, country_id: value}});
  }

  getCityById = (cities, cityId) => {
    const city = cities.filter(city => city.id === cityId);
    if (city) return {...city[0]};
    return null;
  }

  handlePreEdit = (cityId) => {
    let city = {name: '', country_id: this.props.countries[0].id, image: '', image_path: '', currency: ''}
    if (cityId && this.props.cities.length > 0) {
      city = this.getCityById(this.props.cities, cityId);
      document.getElementById("imagePreview").innerHTML = "<img src='" + city.image + "' width='40' height='40' />";
    }
    
    this.setState({
      city
    })
    
  }

  handlePreDelete = (cityKey) => {
    this.setState({
        deleteDialogOpen: true,
        deleteKey: cityKey
      })
  }

  handleDelete = () => {
    Helper.deleteItem(this);
  }

  handleDialogClose = () => {
    this.setState({
          deleteDialogOpen: false,
          deleteKey: ''
        })
  }

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

      if(this.state.city.id){
        const cityId = this.state.city.id;
        let city = {...this.state.city};

        delete city.id;
        this.dbRef.child(cityId).update({
          ...city,
          updated: firebase.database.ServerValue.TIMESTAMP
        },
        (error) => {
            
          if(error){            
            this.setState({
              snackMessage: 'Failed connecting to server',
              snackOpen: true,
            });
          }else{
            document.getElementById("imagePreview").innerHTML = '';
            document.getElementById("cityImage").value = null;
            this.setState({
              city: {name: '', country_id: this.props.countries[0].id, image: '', image_path: '', currency: ''},
              error: {name: '', currency: ''},
              notValid: true,
              snackOpen: true,
              snackMessage: 'City updated',
              isSending: false,
              isSent: true
            })
          }
        });
      }else{
        let city = {...this.state.city};
        city.created = firebase.database.ServerValue.TIMESTAMP
        this.dbRef.push(
          city,
          (error) => {
            
            if(error){            
              this.setState({
                snackMessage: 'Failed connecting to server',
                snackOpen: true,
              });
            }else{
              document.getElementById("imagePreview").innerHTML = '';
              document.getElementById("cityImage").value = null;
              this.setState({
                city: {name: '', country_id: this.props.countries[0].id, image: '', image_path: '', currency: ''},
                error: {name: '', currency: ''},
                notValid: true,
                snackOpen: true,
                snackMessage: 'New city added',
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
  }

  render() {    

    return (
      <div style={{textAlign: 'left', padding: 20, background: 'white', border: '1px solid #ddd', marginBottom: 10}}>
        <div className='_dark-heading'> City </div> 
        <div className='row top-lg'>
          <div className="col-xs-12 col-lg-3 _dark-title">{this.state.city.id ? 'Edit City:' : 'Add new city:'}</div>           
          <div className="col-xs-12 col-lg-2"><TextField floatingLabelText="Name" name="name" value={this.state.city.name} errorText={this.state.error.name} fullWidth={true} onChange={this.handleChange} /></div>
          <div className="col-xs-12 col-lg-2"><TextField floatingLabelText="Currency"  name="currency" value={this.state.city.currency} errorText={this.state.error.currency} fullWidth={true} onChange={this.handleChange} /></div>          
          <div className="col-xs-12 col-lg-2">
            <DropDownMenu name="country_id" value={this.state.city.country_id} onChange={this.handleCountryChange} style={{marginTop:16}}>              
              {this.props.countries.map( (row, index) => (
                <MenuItem key={row.id} value={row.id} primaryText={row.name} />
              ))}
            </DropDownMenu>
          </div>
          <div className="col-xs-12 col-lg-3">
            <div style={{marginTop:24}}>
              <div className="_dark-body1 grey400">City image:</div>
              <input name="image" id="cityImage" onChange={this.handleChange} type="file" />
              <div id="imagePreview"></div>
            </div>
          </div>
        </div>
        <div style={{marginTop: 10, marginBottom: '20px'}}><RaisedButton disabled={this.state.notValid} label={this.state.city.id ? 'Save' : 'Add City'} primary={true} onTouchTap={this.handleSubmit} /></div>
        <TableCity cities={this.props.cities} handleDelete={this.handlePreDelete} handleEdit={this.handlePreEdit} />
        <Alert 
          title="Delete city"
          state={this.state} 
          handleDialogClose={this.handleDialogClose}
          handleDelete={this.handleDelete}
          snackClose={this.snackClose}
        />
      </div>
      
    );
  }
}

function mapStateToProps(state, ownProps) {
  console.log("map prop", state)
  // debugger;
  return {
    countries: state.countries,
    cities: state.cities
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(cityActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CityContainer);