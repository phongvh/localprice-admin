import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import {grey50, grey400, grey700} from 'material-ui/styles/colors';
import IconClose from 'material-ui/svg-icons/navigation/close';

import Helper from '../utils/Helper';

const styles = {
	box: {
		backgroundColor: grey50,
		margin: '10px 0',
		padding: 10,
		position: 'relative'
	},
	header: {
		position: 'absolute',
		fontSize: 13,
		fontWeight: 500,		
	}
}

class PlaceForm extends Component {
	constructor(props) {
    super(props);
    this.props.place.price = Helper.formatMoney(this.props.place.price);
    this.state = {    	
    	errorName: '',
    	errorAddress: '',
    	errorLat: '',
    	errorLng: ''
    }
    this.name = this.props.place.name
  	this.address = this.props.place.address
  	this.lat = this.props.place.lat
  	this.lng = this.props.place.lng
  }

  componentDidMount() {
  	this.autocomplete = new window.google.maps.places.Autocomplete(
            (document.getElementById('placeName-' + this.props.number)));
  	this.autocomplete.addListener('place_changed', this.fillInAddress);
  }

  fillInAddress = () => {
  	const place = this.autocomplete.getPlace();

  	this.name = place.name
  	this.address = place.formatted_address
  	this.lat = place.geometry.location.lat()
  	this.lng = place.geometry.location.lng()

  	// we have to put it (isPlaceValid) here before calling handlePlaceChange
  	// but in handleChange function below, it still works 
  	// when we put it after calling handlePlaceChange
  	if(this.name && this.address && this.lat && this.lng){
  		this.props.isPlaceValid(this.props.placeId, true);
  	}else this.props.isPlaceValid(this.props.placeId, false);	

  	this.props.handlePlaceChange(this.props.placeId, {
  		name: place.name,
    	address: place.formatted_address,
    	lat: place.geometry.location.lat(),
    	lng: place.geometry.location.lng(),
    	tel: place.international_phone_number || '',
    	website: place.website || '',
    	google_id: place.place_id
  	})
  }

  handleChange = (event) => {
  	const reqField = [
  		{name: 'name', error: 'errorName'},
  		{name: 'address', error: 'errorAddress'},
  		{name: 'lat', error: 'errorLat'},
  		{name: 'lng', error: 'errorLng'}
  	]
  	const state = {};
  	const changeData = {};
  	reqField.forEach((field) => {
  		if(event.target.name === field.name) {
  			if(event.target.value) {
	  			this[field.name] = event.target.value;
	  			state[field.error] = '';	  			
	  		}else{
	  			this[field.name] = '';
	  			state[field.error] = field.name + ' is required';
	  		}	  		
	  		this.setState(state);
	  		changeData[field.name] = event.target.value;
	  		this.props.handlePlaceChange(this.props.placeId, changeData);
	  	}
  	})

  	if(event.target.name === 'price') {
  		this.props.handlePlaceChange(this.props.placeId, {price: Helper.formatMoney(event.target.value)});
  	}

  	if(event.target.name === 'tel') {
  		this.props.handlePlaceChange(this.props.placeId, {tel: event.target.value});
  	}

  	if(event.target.name === 'website') {
  		this.props.handlePlaceChange(this.props.placeId, {website: event.target.value});
  	}

  	if(this.name && this.address && this.lat && this.lng){
  		this.props.isPlaceValid(this.props.placeId, true);
  	}else this.props.isPlaceValid(this.props.placeId, false);
  }

  handlePlaceDelete = () => {
  	this.props.handlePlaceDelete(this.props.placeId)
  }

	render() {
		return (
			<div style={styles.box}>
      	<div style={styles.header}>Place {this.props.number}</div>
      	<div style={{float: 'right'}}><IconClose color={grey400} hoverColor={grey700} viewBox='0 0 28 28' style={{cursor: 'pointer'}} onTouchTap={this.handlePlaceDelete} /></div>
				<div className='row left-lg'>
          <div className="col-xs-12 col-lg-4">
          	<TextField id={"placeName-" + this.props.number} floatingLabelFixed={true} floatingLabelText="Name*" name="name" value={this.props.place.name} 
          	errorText={this.state.errorName} fullWidth={true} onChange={this.handleChange} />
          </div>
          <div className="col-xs-12 col-lg-8">
          	<TextField floatingLabelText="Address*"  name="address" value={this.props.place.address} 
          	errorText={this.state.errorAddress} fullWidth={true} onChange={this.handleChange} />
          </div>
        </div>
        <div className='row left-lg'>
          <div className="col-xs-12 col-lg-2">
          	<TextField floatingLabelText="Latitude*"  name="lat" value={this.props.place.lat} 
          	errorText={this.state.errorLat} fullWidth={true} onChange={this.handleChange} />
          </div>
          <div className="col-xs-12 col-lg-2">
          	<TextField floatingLabelText="Longitude*" name="lng" value={this.props.place.lng} 
          	errorText={this.state.errorLng} fullWidth={true} onChange={this.handleChange} />
          </div>
          <div className="col-xs-12 col-lg-2">
          	<TextField floatingLabelText="Price" name="price" value={this.props.place.price} 
          	errorText={this.state.errorPrice} fullWidth={true} onChange={this.handleChange} />
          </div>
        </div>
        <div className='row left-lg'>
          <div className="col-xs-12 col-lg-3">
          	<TextField floatingLabelText="Tel." name="tel" value={this.props.place.tel} 
          	errorText='' fullWidth={true} onChange={this.handleChange} />
          </div>
          <div className="col-xs-12 col-lg-5">
          	<TextField floatingLabelText="Website" name="website" value={this.props.place.website} 
          	errorText='' fullWidth={true} onChange={this.handleChange} />
          </div>
        </div>
      </div>
		);
	}
}

export default PlaceForm;