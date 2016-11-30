import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import IconPlay from 'material-ui/svg-icons/av/volume-up';
import PlaceFormArea from './PlaceFormArea';

class AddItemForm extends Component {

	constructor(props) {		
    super(props);
    props.state.city = props.stateFilter.city;
    props.state.category = props.stateFilter.category;
  }

	handleChange = (event) => {
		this.props.handleChange(event);
	}

	render() {
		return (
			<div>
				<div className='row left-lg'>
          <div className="col-xs-12 col-lg-4">
          	<SelectField name="city" floatingLabelText="City" 
		          value={this.props.state.city} onChange={this.props.handleCityChange} 
		          fullWidth={true} disabled={this.props.stateFilter.editMode ? true : false}
		        >
              {this.props.stateFilter.cityArray.map( (row, index) => (
                <MenuItem key={row.key} value={row.key} primaryText={row.name} />
              ))}
            </SelectField>
          </div>
          <div className="col-xs-12 col-lg-4">
          	<SelectField name="category" floatingLabelText="Category"
		          value={this.props.state.category} onChange={this.props.handleCategoryChange} 
		           fullWidth={true} disabled={this.props.stateFilter.editMode ? true : false}
		        >
          		{this.props.stateFilter.catArray.map( (row, index) => (
                <MenuItem key={row.key} value={row.key} primaryText={row.name} />
              ))}
        		</SelectField>
          </div>
        </div>
				<div className='row left-lg'>
          <div className="col-xs-12 col-lg-5">
          	<TextField floatingLabelText="English Name *" name="enName" value={this.props.state.enName} 
          	errorText={this.props.state.errorEnName} fullWidth={true} onChange={this.handleChange} />
          </div>

          <div className="col-xs-12 col-lg-5">
          	<TextField floatingLabelText="Local Name *"  name="locName" value={this.props.state.locName} 
          	errorText={this.props.state.errorLocName} fullWidth={true} onChange={this.handleChange} />
          </div>
        </div>
        <div className='row left-lg' style={{marginTop: 24}}>
        	<div className="col-xs-12 col-lg-1">
        		<label className="_dark-body2">Image*:</label> 
        	</div>
          <div className="col-xs-12 col-lg-3">
          	<input name="image" id="itemImage" style={{width: '100%'}} onChange={this.handleChange} type="file" />
          </div>
          <div className="col-xs-12 col-lg-2">
          	<div id="imagePreview">{this.props.state.image ? <img src={this.props.state.image} width={40} height={40} alt='Image' /> : ''}</div>
          </div>
          <div className="col-xs-12 col-lg-1">
        		<label className="_dark-body2">Audio*:</label> 
        	</div>
          <div className="col-xs-12 col-lg-3">
          	<input name="audio" id="itemAudio" style={{width: '100%'}} onChange={this.handleChange} type="file" />
          </div>
          <div className="col-xs-12 col-lg-2">
          	<IconPlay className={this.props.state.audio ? 'show' : 'hide'} style={{cursor: 'pointer'}} onTouchTap={this.props.handlePlay} />
          	<div id="audioPreview">{this.props.state.audio ? <audio id="audioPlay" src={this.props.state.audio}></audio> : ''}</div>
          </div>
        </div>        
        <div className='row left-lg'>
          <div className="col-xs-12 col-lg-2">
          	<TextField floatingLabelText="Avg. Price *" name="price" value={this.props.state.price} 
          	errorText={this.props.state.errorPrice} fullWidth={true} onChange={this.handleChange} />
          </div>
          <div className="col-xs-12 col-lg-2">
          	<TextField floatingLabelText="Min"  name="minPrice" value={this.props.state.minPrice} 
          	errorText={this.props.state.errorMinPrice} fullWidth={true} onChange={this.handleChange} />
          </div>
          <div className="col-xs-12 col-lg-2">
          	<TextField floatingLabelText="Max"  name="maxPrice" value={this.props.state.maxPrice} 
          	errorText={this.props.state.errorMaxPrice} fullWidth={true} onChange={this.handleChange} />
          </div>
          <div className="col-xs-12 col-lg-2">
          	<TextField floatingLabelText="Currency *" name="currency" value={this.props.state.currency} 
          	errorText={this.props.state.errorCurrency} fullWidth={true} onChange={this.handleChange} />
          </div>
          <div className="col-xs-12 col-lg-2">
          	<TextField floatingLabelText="Unit *" name="unit" value={this.props.state.unit} 
          	errorText={this.props.state.errorUnit} fullWidth={true} onChange={this.handleChange} />
          </div>
        </div>        
        <div className='row left-lg'>
          <div className="col-xs-12">
          	<TextField name="information" value={this.props.state.information}
				      hintText="Information" onChange={this.handleChange}
				      floatingLabelText="Information"
				      multiLine={true}
				      fullWidth={true}
				      rows={2}
				    />
          </div>
        </div>
        <PlaceFormArea places={this.props.state.place} placeCount={this.props.state.placeCount} handleAddPlace={this.props.handleAddPlace} handlePlaceChange={this.props.handlePlaceChange} /> 
			</div>
		);
	}
}

export default AddItemForm;