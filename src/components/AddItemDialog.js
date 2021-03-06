import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import AddItemForm from './AddItemForm';
import Helper from '../utils/Helper';

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
    this.placeLoaded = {};
    this.placeValid = {};
    this.placeDelete = [];
    this.uniqueName = Helper.uniqueId() + '_' + Date.now();    
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
    this.placeLoaded = {};
    this.placeValid = {};
    this.placeDelete = [];
    this.uniqueName = Helper.uniqueId() + '_' + Date.now();
  }

  componentDidUpdate(prevProps, prevState) {
  	
    if(this.props.state.editMode && !this.state.stateUpdated){
    	let path = this.props.state.editItem.image_path;
    	this.uniqueName = path.substr(path.lastIndexOf('/')).split('.')[0];

    	if(typeof this.props.state.editItem.place === "object"){
    		for(let placeId in this.props.state.editItem.place){
    			this.placeValid[placeId] = true;
    		}
    	}

    	let state = {
	    	city: this.props.state.city,
	    	category: this.props.state.category,
	    	enName: this.props.state.editItem.name_en,
	    	locName: this.props.state.editItem.name_loc,
	    	image: this.props.state.editItem.image,
	    	imagePath: this.props.state.editItem.image_path,
	    	imageSmall: this.props.state.editItem.image_small,
	    	audio: this.props.state.editItem.audio,
	    	audioPath: this.props.state.editItem.audio_path,
	    	price: Helper.formatMoney(this.props.state.editItem.price) || '',
	    	minPrice: Helper.formatMoney(this.props.state.editItem.price_min) || '',
	    	maxPrice: Helper.formatMoney(this.props.state.editItem.price_max) || '',
	    	currency: this.props.state.editItem.currency,
	    	unit: this.props.state.editItem.unit,
	    	information: this.props.state.editItem.information,
	    	place: {},
	    	placeCount: this.props.state.editItem.place_count,
	    	notValid: true,	    	
	    	stateUpdated: true
	    }

	    this.setState(state);

	    let places = this.props.state.editItem.place;
	    for(let key in places){
        this.placeLoaded[key] = false;
        firebase.database().ref(places[key].ref).once("value", (snap) => {
          let place = snap.val()          
          places[key] = {
            name: place.name,
            address: place.address,
            lat: place.lat,
            lng: place.lng,
            price: places[key].price,
            tel: place.tel,
            google_id: place.google_id,
            website: place.website,
            ref_count: place.ref_count
          }
          this.placeLoaded[key] = true;
          let allTrue = true;
          for(let i in this.placeLoaded){
          	allTrue = allTrue && this.placeLoaded[i];
          }
          if(allTrue){
	          this.setState({
	            place: places
	          })
	        }
        });        
      }

    	
	    //document.getElementById("imagePreview").innerHTML = "<img src='" + this.props.state.editItem.image_small + "' width='40' height='40' />";	    
	    //document.getElementById("audioPreview").innerHTML = 
      //  '<audio id="audioPlay" src="'+this.props.state.editItem.audio+'"></audio>';
    }
    //console.log('run1')
		let placeValid = true;
    for(let placeId in this.placeValid) {
    	if(!this.placeValid[placeId]){
    		placeValid = false;
    		if(!this.state.notValid){
    			//console.log('run')
	    		this.setState({
		        notValid: true
		      });
	    	}
    		break;
    	}
    }

    if(this.state.enName && this.state.locName && this.state.price && this.state.notValid
    	&& this.state.currency && this.state.unit && this.state.image && this.state.audio && placeValid){ 
    	
      this.setState({
        notValid: false
      });
    	//return;
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
  				if(field.name === 'price') state[field.name] = Helper.formatMoney(event.target.value);
	  			else state[field.name] = event.target.value;
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
  		this.setState({minPrice: Helper.formatMoney(event.target.value)});
  	}

  	if(event.target.name === 'maxPrice') {
  		this.setState({maxPrice: Helper.formatMoney(event.target.value)});
  	}

  	if(event.target.name === 'information') {
  		this.setState({information: event.target.value});
  	}

  	if(event.target.name === 'image'){
      let file = event.target.files[0];
      //console.log(file);
      if(file.type.toLowerCase() !== 'image/png' && file.type.toLowerCase() !== 'image/jpeg'){
      	alert('Error: A png or jpeg file is required');
      	event.target.value = null;
      	return false;
      }
      if(file.size > 102400){
      	alert('Error: File must be smaller than 100KB');
      	event.target.value = null;
      	return false;
      }
      //let fileName = this.uniqueName + file.name.substr(file.name.lastIndexOf('.'));
      let fileName = 'localprice_' + Date.now() + '_' + file.name;
      let fileRef = firebase.storage().ref('item/image/').child(this.state.city).child(this.state.category).child(fileName);
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
      if(file.type.toLowerCase() !== 'audio/mp3'){
      	alert('Error: An mp3 file is required');
      	event.target.value = null;
      	return false;
      }
      if(file.size > 102400){
      	alert('Error: File must be smaller than 100KB');
      	event.target.value = null;
      	return false;
      }
      //let fileName = this.uniqueName + file.name.substr(file.name.lastIndexOf('.'));
      let fileName = 'localprice_' + Date.now() + '_' + file.name;
      let fileRef = firebase.storage().ref('item/audio/').child(this.state.city).child(this.state.category).child(fileName);
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

  handlePlaceDelete = (placeId) => {
  	const place = this.state.place;
  	delete place[placeId];
  	delete this.placeValid[placeId];
  	if(placeId.indexOf('place_') !== 0){
  		this.placeDelete.push(placeId);
  	}
  	this.setState({place: place, placeCount: this.state.placeCount - 1});
  }

  handleAddPlace = () => {
  	const place = this.state.place;
  	const placeId = 'place_' + (this.state.placeCount + 1)
  	place[placeId] = {
  		name: '',
    	address: '',
    	lat: '',
    	lng: '',
    	price: '',
    	tel: '',
    	website: '',
  	}
  	this.placeValid[placeId] = false;
  	this.setState({place: place, placeCount: this.state.placeCount + 1, notValid: true});
  }

  isPlaceValid = (placeId, valid) => {
  	console.log(placeId, valid)
  	this.placeValid[placeId] = valid
  }

  handlePlay = () => {
    const audio = document.getElementById('audioPlay')
    if (audio.paused) {
        audio.play();
    }else{
        audio.pause();
        audio.currentTime = 0
    }
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
	    	price: parseFloat(Helper.unFormatMoney(this.state.price)),
	    	price_min: parseFloat(Helper.unFormatMoney(this.state.minPrice)) || null,
	    	price_max: parseFloat(Helper.unFormatMoney(this.state.maxPrice)) || null,
	    	currency: this.state.currency,
	    	unit: this.state.unit,
	    	information: Helper.convertNewLine(this.state.information),
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
		  			let price = parseFloat(Helper.unFormatMoney(places[placeId].price)) || null;
		  			let place = {
		  				name: places[placeId].name,
		  				address: places[placeId].address,
		  				lat: parseFloat(places[placeId].lat),
		  				lng: parseFloat(places[placeId].lng),
		  				tel: places[placeId].tel || null,
		  				website: places[placeId].website || null,
		  				google_id: places[placeId].google_id || null,
		  				updated: firebase.database.ServerValue.TIMESTAMP 
		  			}
		  			if(placeId.indexOf('place_') === 0){
		  				let ref = firebase.database().ref('place').child(this.state.city);

		  				if(place.google_id){

				  			ref.orderByChild("google_id").equalTo(place.google_id).once("value", (snap) => {
				  				let result = snap.val();
				  				if(result){
				  					let placeKey = Object.keys(result)[0];
				  					//console.log(result[placeKey]);
				  					place.ref_count = result[placeKey].ref_count ? result[placeKey].ref_count + 1 : 1;
			  						ref.child(placeKey).update(place);
			  						itemRef.child('place').child(placeKey).set({
			  							price: price,
			  							ref: 'place/' + this.state.city + '/' + placeKey
			  						});
				  				}else{
				  					place.ref_count = 1;
				  					place.created = firebase.database.ServerValue.TIMESTAMP 
				  					let placeRef = ref.push(place, (error) => {});
				  					itemRef.child('place').child(placeRef.key).set({
				  						price: price,
				  						ref: 'place/' + this.state.city + '/' + placeRef.key
				  					});
				  				}
				  			})
				  		}else{
				  			place.ref_count = 1;
		  					place.created = firebase.database.ServerValue.TIMESTAMP 
		  					let placeRef = ref.push(place, (error) => {});
		  					itemRef.child('place').child(placeRef.key).set({
		  						price: price,
		  						ref: 'place/' + this.state.city + '/' + placeRef.key
		  					});
				  		}
		  			}else{
		  				firebase.database().ref('place').child(this.state.city).child(placeId).update(place);
		  				itemRef.child('place').child(placeId).update({price: price});
		  			}		  			
        	}  
        	this.placeDelete.forEach( (placeId) => {
	      		itemRef.child('place').child(placeId).set(null);
	      	});      	
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
		    	price: parseFloat(Helper.unFormatMoney(this.state.price)),
		    	price_min: parseFloat(Helper.unFormatMoney(this.state.minPrice)) || null,
		    	price_max: parseFloat(Helper.unFormatMoney(this.state.maxPrice)) || null,
		    	currency: this.state.currency,
		    	unit: this.state.unit,
		    	information: Helper.convertNewLine(this.state.information),
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
			  			let price = parseFloat(Helper.unFormatMoney(places[placeId].price)) || null;
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
			  			let ref = firebase.database().ref('place').child(this.state.city);

			  			if(place.google_id){
				  			ref.orderByChild("google_id").equalTo(place.google_id).once("value", (snap) => {
				  				let result = snap.val();
				  				
				  				if(result){
				  					let placeKey = Object.keys(result)[0]
				  					place.ref_count = result[placeKey].ref_count ? result[placeKey].ref_count + 1 : 1;
			  						ref.child(placeKey).update(place);
			  						itemRef.child('place').child(placeKey).set({
			  							price: price,
			  							ref: 'place/' + this.state.city + '/' + placeKey
			  						});
				  				}else{
				  					place.ref_count = 1;
				  					let placeRef = ref.push(place, (error) => {});
				  					itemRef.child('place').child(placeRef.key).set({
				  						price: price,
				  						ref: 'place/' + this.state.city + '/' + placeRef.key
				  					});
				  				}
				  			})
				  		}else{
				  			place.ref_count = 1;
		  					let placeRef = ref.push(place, (error) => {});
		  					itemRef.child('place').child(placeRef.key).set({
		  						price: price,
		  						ref: 'place/' + this.state.city + '/' + placeRef.key
		  					});
				  		}
			  		}
	        	firebase.database().ref('statistic/item').once('value', (snap) => {
	        		let itemStat = snap.val();
	        		itemStat.total = itemStat.total ? itemStat.total + 1 : 1;
	        		//itemStat[this.state.city].total = itemStat[this.state.city].total ? itemStat[this.state.city].total + 1 : 1;
	        		//const catTotal = itemStat[this.state.city][this.state.category]
	        		//itemStat[this.state.city][this.state.category] = catTotal ? catTotal + 1 : 1;
	        		firebase.database().ref('statistic/item').update(itemStat);
	        	})
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
          autoDetectWindowHeight={false}
          contentStyle={{marginBottom: '100px'}}
          style={{overflow: 'auto'}}
          overlayStyle={{width: '99%'}}
          onRequestClose={this.handleAddItemClose}
        >
        	<AddItemForm handleChange={this.handleChange} handlePlay={this.handlePlay} handlePlaceChange={this.handlePlaceChange} 
	        	handleCityChange={this.handleCityChange} handleCategoryChange={this.handleCategoryChange} handleAddPlace={this.handleAddPlace}
	        	handlePlaceDelete={this.handlePlaceDelete} stateFilter={this.props.state} state={this.state} 
	        	isPlaceValid={this.isPlaceValid}
        	/>
        </Dialog>
			</div>
		);
	}
}

export default AddItemDialog;