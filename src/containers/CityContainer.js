import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

import Alert from '../components/Alert';
import TableCity from '../components/TableCity';
import Helper from '../utils/Helper';

import * as firebase from 'firebase';

class CityContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countryData: [],
      tableData: [],
      cityName: '',
      cityImage: '',
      imageStoragePath: '',
      cityCurrency: '',
      cityCountry: '',
      errorName: '',
      errorCurrency: '',
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
    this.countryListener = undefined;
    this.cityListener = undefined;
    this.defaultCountry = undefined;
    this.fileStorage = firebase.storage().ref('city');
    this.dbRef = firebase.database().ref('city');
  }

  componentDidMount() {
    Helper.showLoading();
    const countryRef = firebase.database().ref().child('country');
    this.countryListener = countryRef.on('value' , snap => {
      let countryData = [];
      let itemsList = snap.val();
      Object.keys(itemsList).map((itemKey) => {
        itemsList[itemKey].countryKey = itemKey;
        countryData.push(itemsList[itemKey]);
        return null;
      });
      this.defaultCountry = countryData.reverse()[0].countryKey;
      this.setState({countryData: countryData, cityCountry: this.defaultCountry})
    });
    
    this.cityListener = this.dbRef.on('value' , snap => {
      let tableData = [];
      let itemsList = snap.val();
      Object.keys(itemsList).map((itemKey) => {
        itemsList[itemKey].cityKey = itemKey;
        tableData.push(itemsList[itemKey]);
        return null;
      });
      this.setState({tableData: tableData.reverse()})
      Helper.hideLoading();
    });
  }

  componentWillUnmount() {
    if(typeof this.countryListener === "object"){
      this.countryListener.off();
    }
    if(typeof this.cityListener === "object"){
      this.cityListener.off();
    }
  }

  componentDidUpdate(prevProps, prevState) {

    Helper.checkSync(this);
    
    if(this.state.cityName && this.state.cityCurrency && this.state.cityImage && this.state.cityCountry && this.state.notValid){      
      this.setState({
          notValid: false
        });
    }    
    
  }

  handleChange = (event) => {
    
    if(event.target.name === 'cityName') {
      if(event.target.value)
        this.setState({
          cityName: event.target.value,
          errorName: ''
        });
      else {

        this.setState({
          cityName: '',
          errorName: 'City Name is required',
          notValid: true
        });
      }
    }else if(event.target.name === 'cityCurrency'){
      if(event.target.value)
        this.setState({
          cityCurrency: event.target.value,
          errorCurrency: ''
        });
      else 
        this.setState({
          cityCurrency: '',
          errorCurrency: 'Currency is required',
          notValid: true
        });
    }else if(event.target.name === 'cityImage'){
      let file = event.target.files[0];
      if(file.type.toLowerCase() !== 'image/png' && file.type.toLowerCase() !== 'image/jpeg'){
        alert('Error: A png or jpeg file is required');
        event.target.value = null;
        return false;
      }
      let fileRef = this.fileStorage.child(file.name);
      let task = fileRef.put(file).then((snap) => {
        document.getElementById("imagePreview").innerHTML = "<img src='" + snap.downloadURL + "' width='40' height='40' />";
        this.setState({
          cityImage: snap.downloadURL,
          imageStoragePath: snap.metadata.fullPath
        });
      });
    }
  }

  handleCountryChange = (event, index, value) => {
    this.setState({cityCountry: value});
  }

  handleSubmit = () => {
    if(this.state.cityName && this.state.cityCurrency && this.state.cityImage && this.state.cityCountry){
      this.setState({
              isSending: true,
              isSent: false
            });
      //const newCountryRef = firebase.database().ref().child('country').push();
      //newCountryRef.update({ name: this.state.countryName, country_code: this.state.countryCode, created: firebase.database.ServerValue.TIMESTAMP });
      
      if(this.state.editMode){
        this.dbRef.child(this.state.editKey).update({
          name: this.state.cityName, 
          country_id: this.state.cityCountry, 
          currency: this.state.cityCurrency,
          image: this.state.cityImage,
          image_path: this.state.imageStoragePath,
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
              cityName: '',
              cityCountry: this.defaultCountry,
              cityCurrency: '',
              cityImage: '',
              imageStoragePath: '',
              errorName: '',
              errorCode: '',
              notValid: true,
              snackMessage: 'City updated',
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
            name: this.state.cityName, 
            country_id: this.state.cityCountry, 
            currency: this.state.cityCurrency,
            image: this.state.cityImage,
            image_path: this.state.imageStoragePath,
            created: firebase.database.ServerValue.TIMESTAMP 
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
                cityName: '',
                cityCountry: this.defaultCountry,
                cityCurrency: '',
                cityImage: '',
                imageStoragePath: '',
                errorName: '',
                errorCode: '',
                notValid: true,
                snackMessage: 'New city added',
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
  }

  handlePreEdit = (cityKey) => {
    this.dbRef.child(cityKey).once("value", (snap) => {
      const city = snap.val()
      document.getElementById("imagePreview").innerHTML = "<img src='" + city.image + "' width='40' height='40' />";
      this.setState({
        cityName: city.name,
        cityCountry: city.country_id,
        cityCurrency: city.currency,
        cityImage: city.image,
        imageStoragePath: city.image_path,
        editMode: true,
        editKey: cityKey
      })
    });
    
  }

  handlePreDelete = (cityKey) => {
    this.setState({
        deleteDialogOpen: true,
        deleteKey: cityKey
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
        <div className='_dark-heading'> City </div> 
        <div className='row top-lg'>
          <div className="col-xs-12 col-lg-3 _dark-title">{this.state.editMode ? 'Edit City:' : 'Add new city:'}</div>           
          <div className="col-xs-12 col-lg-2"><TextField floatingLabelText="Name" name="cityName" value={this.state.cityName} errorText={this.state.errorName} fullWidth={true} onChange={this.handleChange} /></div>
          <div className="col-xs-12 col-lg-2"><TextField floatingLabelText="Currency"  name="cityCurrency" value={this.state.cityCurrency} errorText={this.state.errorCurrency} fullWidth={true} onChange={this.handleChange} /></div>          
          <div className="col-xs-12 col-lg-2">
            <DropDownMenu name="cityCountry" value={this.state.cityCountry} onChange={this.handleCountryChange} style={{marginTop:16}}>              
              {this.state.countryData.map( (row, index) => (
                <MenuItem key={row.countryKey} value={row.countryKey} primaryText={row.name} />
              ))}
            </DropDownMenu>
          </div>
          <div className="col-xs-12 col-lg-3"><div style={{marginTop:24}}><div className="_dark-body1 grey400">City image:</div> <input name="cityImage" id="cityImage" onChange={this.handleChange} type="file" /><div id="imagePreview"></div></div></div>
        </div>
        <div style={{marginTop: 10, marginBottom: '20px'}}><RaisedButton disabled={this.state.notValid} label={this.state.editMode ? 'Save' : 'Add City'} primary={true} onTouchTap={this.handleSubmit} /></div>
        <TableCity tableData={this.state.tableData} handleDelete={this.handlePreDelete} handleEdit={this.handlePreEdit} />
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

export default CityContainer;