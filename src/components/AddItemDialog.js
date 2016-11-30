import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import AddItemForm from './AddItemForm';
import * as firebase from 'firebase';

class AddItemDialog extends Component {
	constructor(props) {		
    super(props);
    
    this.state = {
    	city: '',
    	category: '',
    	enName: '',
    	locName: '',
    	image: '',
    	image_small: '',
    	imagePath: '',
    	audio: '',
    	audioPath: '',
    	price: '',
    	minPrice: '',
    	maxPrice: '',
    	currency: 'VND',
    	unit: '',
    	information: '',
    	place: {},
    	placeCount: 0,
    	notValid: true,
    	stateUpdated: false
    }
  }

  reset() {
  	console.log("reset dialog");
  	this.setState({
    	city: this.props.state.city,
    	category: this.props.state.category,
    	enName: '',
    	locName: '',
    	image: '',
    	imageSmall: '',
    	imagePath: '',
    	audio: '',
    	audioPath: '',
    	price: '',
    	minPrice: '',
    	maxPrice: '',
    	currency: 'VND',
    	unit: '',
    	information: '',
    	place: {},
    	placeCount: 0,
    	notValid: true,
    	stateUpdated: false,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.props.state.editMode && !this.state.stateUpdated){
    	this.setState({
	    	city: this.props.state.city,
	    	category: this.props.state.category,
	    	enName: this.props.state.editItem.name_en,
	    	locName: this.props.state.editItem.name_loc,
	    	image: this.props.state.editItem.image,
	    	imagePath: this.props.state.editItem.image_path,
	    	imageSmall: this.props.state.editItem.image_small,
	    	audio: this.props.state.editItem.audio,
	    	audioPath: this.props.state.editItem.audio_path,
	    	price: this.props.state.editItem.price,
	    	minPrice: this.props.state.editItem.price_min,
	    	maxPrice: this.props.state.editItem.price_max,
	    	currency: this.props.state.editItem.currency,
	    	unit: this.props.state.editItem.unit,
	    	information: this.props.state.editItem.information,
	    	place: this.props.state.editItem.place,
	    	placeCount: this.props.state.editItem.place_count,
	    	notValid: true,
	    	stateUpdated: true
	    });
	    //document.getElementById("imagePreview").innerHTML = "<img src='" + this.props.state.editItem.image_small + "' width='40' height='40' />";	    
	    //document.getElementById("audioPreview").innerHTML = 
      //  '<audio id="audioPlay" src="'+this.props.state.editItem.audio+'"></audio>';
    }
    
    if(this.state.enName && this.state.locName && this.state.price && this.state.notValid
    	&& this.state.currency && this.state.unit && this.state.image && this.state.audio){      
      this.setState({
        notValid: false
      });
    }   
  }

  handleChange = (event) => {
  	const reqField = [
  		{name: 'enName', error: 'errorEnName'},
  		{name: 'locName', error: 'errorLocName'},
  		{name: 'price', error: 'errorPrice'},
  		{name: 'currency', error: 'errorCurrency'},
  		{name: 'unit', error: 'errorUnit'},
  	]
  	const state = {};
  	reqField.forEach((field) => {
  		if(event.target.name === field.name) {
  			if(event.target.value) {
	  			state[field.name] = event.target.value;
	  			state[field.error] = '';
	  			this.setState(state);
	  		}else{
	  			state[field.name] = '';
	  			state[field.error] = field.name + ' is required';
	  			state.notValid = true
	  			this.setState(state);
	  		}
	  	}
  	})

  	if(event.target.name === 'minPrice') {
  		this.setState({minPrice: event.target.value});
  	}

  	if(event.target.name === 'maxPrice') {
  		this.setState({maxPrice: event.target.value});
  	}

  	if(event.target.name === 'information') {
  		this.setState({information: event.target.value});
  	}

  	if(event.target.name === 'image'){
      let file = event.target.files[0];
      let fileRef = firebase.storage().ref('item/image/').child(this.state.city).child(this.state.category).child(file.name);
      let task = fileRef.put(file).then((snap) => {
        //document.getElementById("imagePreview").innerHTML = "<img src='" + snap.downloadURL + "' width='40' height='40' />";
        this.setState({
          image: snap.downloadURL,
          imagePath: snap.metadata.fullPath
        });
      });
    }  	

    if(event.target.name === 'audio'){
      let file = event.target.files[0];
      let fileRef = firebase.storage().ref('item/audio/').child(this.state.city).child(this.state.category).child(file.name);
      let task = fileRef.put(file).then((snap) => {
        //document.getElementById("audioPreview").innerHTML = 
        //'<audio id="audioPlay" src="'+snap.downloadURL+'"></audio>';
        this.setState({
          audio: snap.downloadURL,
          audioPath: snap.metadata.fullPath
        });
      });
    }  
  }

  handleCityChange = (event, index, value) => {
    this.setState({city: value});
  }

  handleCategoryChange = (event, index, value) => {
    this.setState({category: value});
  }

  handlePlaceChange = (placeId, placeChange) => {
  	const place = this.state.place;
  	for(let key in placeChange){
  		place[placeId][key] = placeChange[key];
  	}
  	this.setState({place: place});
  }

  handleAddPlace = () => {
  	const place = this.state.place;
  	const placeId = 'place_' + (this.state.placeCount + 1)
  	place[placeId] = {
  		name: '',
    	address: '',
    	lat: '',
    	lng: '',
    	tel: '',
    	website: '',
  	}
  	this.setState({place: place, placeCount: this.state.placeCount + 1});
  }

  handlePlay = () => {
  	document.getElementById('audioPlay').play();
  }

  handleAddItem = () => {
  	const catRef = firebase.database().ref('item').child(this.state.city).child(this.state.category);
  	if(this.props.state.editMode){
  		catRef.child(this.props.state.editItem.key).update({
  			name_en: this.state.enName,
	    	name_loc: this.state.locName,
	    	image: this.state.image,
	    	image_small: this.state.image,
	    	image_path: this.state.imagePath,
	    	audio: this.state.audio,
	    	audio_path: this.state.audioPath,
	    	price: this.state.price,    	
	    	price_min: this.state.minPrice,
	    	price_max: this.state.maxPrice,
	    	currency: this.state.currency,
	    	unit: this.state.unit,
	    	information: this.state.information,
	    	place_count: this.state.placeCount,
        updated: firebase.database.ServerValue.TIMESTAMP 
  		},
  		(error) => {
	        
        if(error){            
          this.props.handleEditItem(false)
        }else{
        	let itemRef = catRef.child(this.props.state.editItem.key);
        	let places = this.state.place;
		  		for(let placeId in places) {
		  			let place = {
		  				name: places[placeId].name,
		  				address: places[placeId].address,
		  				lat: parseFloat(places[placeId].lat),
		  				lng: parseFloat(places[placeId].lng),
		  				tel: places[placeId].tel || '',
		  				website: places[placeId].website || '',
		  				google_id: places[placeId].google_id || '',
		  				updated: firebase.database.ServerValue.TIMESTAMP 
		  			}
		  			if(placeId.indexOf('place_') === 0){
		  				let placeRef = firebase.database().ref('place').push(place, (error) => {});		  		
		  				itemRef.child('place').child(placeRef.key).set(place);
		  			}else{
		  				firebase.database().ref('place').child(placeId).update(place);
		  				itemRef.child('place').child(placeId).update(place);
		  			}
		  			
        	}        	
        }
        
        this.props.handleEditItem(true)
        this.reset()
      })
  	}else{
  		
	  	let itemRef = catRef.push(
	      {         
		    	name_en: this.state.enName,
		    	name_loc: this.state.locName,
		    	image: this.state.image,
		    	image_small: this.state.image,
		    	image_path: this.state.imagePath,
		    	audio: this.state.audio,
		    	audio_path: this.state.audioPath,
		    	price: this.state.price,    	
		    	price_min: this.state.minPrice,
		    	price_max: this.state.maxPrice,
		    	currency: this.state.currency,
		    	unit: this.state.unit,
		    	information: this.state.information,
		    	place_count: this.state.placeCount,
	        created: firebase.database.ServerValue.TIMESTAMP,
	        updated: firebase.database.ServerValue.TIMESTAMP 
	      },
	      (error) => {
	        
	        if(error){            
	          this.props.handleAddItem(false)
	        }else{
	        	let places = this.state.place;
			  		for(let placeId in places) {
			  			let place = {
			  				name: places[placeId].name,
			  				address: places[placeId].address,
			  				lat: parseFloat(places[placeId].lat),
			  				lng: parseFloat(places[placeId].lng),
			  				tel: places[placeId].tel || null,
			  				website: places[placeId].website || null,
			  				google_id: places[placeId].google_id || null,
			  				created: firebase.database.ServerValue.TIMESTAMP,
	        			updated: firebase.database.ServerValue.TIMESTAMP 
			  			}
			  			let placeRef = firebase.database().ref('place').push(place, (error) => {});
			  		
			  			itemRef.child('place').child(placeRef.key).set(place);
			  		}
	        	
	          this.props.handleAddItem(true)
	          this.reset()
	        }
	      }
	    );
	    
	  }
  }

  handleAddItemClose= () => {
  	this.props.handleAddItemClose()
  	this.reset()
  }

	render() {
		
		const actions = [
      <FlatButton
        label="Cancel"
        primary={false}
        onTouchTap={this.handleAddItemClose}
        style={{marginRight:8}}
      />,
      <RaisedButton
        label={this.props.state.editMode ? 'Save' : "Add"}
        labelColor="white"
        primary={true}
        disabled={this.state.notValid}
        onTouchTap={this.handleAddItem}
        style={{marginRight:16, marginLeft:8}}
      />,
    ];
		return (
			<div>				
				<Dialog
          title={this.props.state.editMode ? 'Edit item' : "Add a new item"}
          actions={actions}
          modal={true}
          open={this.props.state.addItemOpen}
          autoDetectWindowHeight={true}
          autoScrollBodyContent={true}
          onRequestClose={this.handleAddItemClose}
        >
        	<AddItemForm handleChange={this.handleChange} handlePlay={this.handlePlay} handlePlaceChange={this.handlePlaceChange}
        	handleCityChange={this.handleCityChange} handleCategoryChange={this.handleCategoryChange} handleAddPlace={this.handleAddPlace}
        	stateFilter={this.props.state} state={this.state} />
        </Dialog>
			</div>
		);
	}
}

export default AddItemDialog;