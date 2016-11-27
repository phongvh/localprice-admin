import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import {red400, pink50} from 'material-ui/styles/colors';
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
    	notValid: true,
    	stateUpdated: false
    }
  }

  reset() {
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

  handlePlay = () => {
  	document.getElementById('audioPlay').play();
  }

  handleAddItem = () => {
  	if(this.props.state.editMode){
  		firebase.database().ref('item').child(this.state.city).child(this.state.category).child(this.props.state.editItem.key).update({
  			name_en: this.state.enName,
	    	name_loc: this.state.locName,
	    	image: this.state.image,
	    	image_small: this.state.imageSmall,
	    	image_path: this.state.imagePath,
	    	audio: this.state.audio,
	    	audio_path: this.state.audioPath,
	    	price: this.state.price,    	
	    	price_min: this.state.minPrice,
	    	price_max: this.state.maxPrice,
	    	currency: this.state.currency,
	    	unit: this.state.unit,
	    	information: this.state.information,
        updated: firebase.database.ServerValue.TIMESTAMP 
  		},
  		(error) => {
	        
        if(error){            
          this.props.handleAddItem(false)
        }else{
        	this.reset()
          this.props.handleAddItem(true)
        }
      })
  	}else{
	  	firebase.database().ref('item').child(this.state.city).child(this.state.category).push(
	      {         
		    	name_en: this.state.enName,
		    	name_loc: this.state.locName,
		    	image: this.state.image,
		    	image_small: this.state.imageSmall,
		    	image_path: this.state.imagePath,
		    	audio: this.state.audio,
		    	audio_path: this.state.audioPath,
		    	price: this.state.price,    	
		    	price_min: this.state.minPrice,
		    	price_max: this.state.maxPrice,
		    	currency: this.state.currency,
		    	unit: this.state.unit,
		    	information: this.state.information,
	        created: firebase.database.ServerValue.TIMESTAMP 
	      },
	      (error) => {
	        
	        if(error){            
	          this.props.handleEditItem(false)
	        }else{
	        	this.reset()
	          this.props.handleEditItem(true)
	        }
	      }
	    );
	  }
  }

  handleAddItemClose= () => {  	
  	this.reset()
  	this.props.handleAddItemClose()
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
        	<AddItemForm handleChange={this.handleChange} handlePlay={this.handlePlay}
        	handleCityChange={this.handleCityChange} handleCategoryChange={this.handleCategoryChange}
        	stateFilter={this.props.state} state={this.state} />
        </Dialog>
			</div>
		);
	}
}

export default AddItemDialog;