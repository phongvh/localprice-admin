import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import {grey50} from 'material-ui/styles/colors';

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
  }

  componentDidMount() {
  	this.autocomplete = new window.google.maps.places.Autocomplete(
            (document.getElementById('placeName-' + this.props.number)));
  	this.autocomplete.addListener('place_changed', this.fillInAddress);
  }

  fillInAddress = () => {
  	const place = this.autocomplete.getPlace();

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
  		{name: 'name', error: 'errorPlaceName'},
  		{name: 'address', error: 'errorPlaceAddress'},
  		{name: 'lat', error: 'errorLat'},
  		{name: 'lng', error: 'errorLng'}
  	]
  	const state = {};
  	reqField.forEach((field) => {
  		if(event.target.name === field.name) {
  			if(event.target.value) {
	  			state[field.name] = event.target.value;
	  			//state[field.error] = '';	  			
	  			this.props.handlePlaceChange(this.props.placeId, state);
	  		}else{
	  			state[field.name] = '';
	  			//state[field.error] = field.name + ' is required';
	  			console.log(state)
	  			this.props.handlePlaceChange(this.props.placeId, state);
	  		}
	  	}
  	})

  	if(event.target.name === 'tel') {
  		this.props.handlePlaceChange(this.props.placeId, {tel: event.target.value});
  	}

  	if(event.target.name === 'website') {
  		this.props.handlePlaceChange(this.props.placeId, {website: event.target.value});
  	}
  }

	render() {
		return (
			<div style={styles.box}>
      	<div style={styles.header}>Place {this.props.number}</div>
				<div className='row left-lg'>
          <div className="col-xs-12 col-lg-4">
          	<TextField id={"placeName-" + this.props.number} floatingLabelFixed={true} floatingLabelText="Name" name="name" value={this.props.place.name} 
          	errorText={this.props.place.errorPlaceName} fullWidth={true} onChange={this.handleChange} />
          </div>
          <div className="col-xs-12 col-lg-8">
          	<TextField floatingLabelText="Address"  name="address" value={this.props.place.address} 
          	errorText={this.props.place.errorPlaceAddress} fullWidth={true} onChange={this.handleChange} />
          </div>
        </div>
        <div className='row left-lg'>
          <div className="col-xs-12 col-lg-2">
          	<TextField floatingLabelText="Latitude"  name="lat" value={this.props.place.lat} 
          	errorText={this.props.place.errorLat} fullWidth={true} onChange={this.handleChange} />
          </div>
          <div className="col-xs-12 col-lg-2">
          	<TextField floatingLabelText="Longitude" name="lng" value={this.props.place.lng} 
          	errorText={this.props.place.errorLng} fullWidth={true} onChange={this.handleChange} />
          </div>
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