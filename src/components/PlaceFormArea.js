import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import IconAddPlace from 'material-ui/svg-icons/maps/add-location';
import PlaceForm from './PlaceForm';

export default class PlaceFormArea extends React.Component {
  /*static propTypes = {
    name: React.PropTypes.string,
  };
*/
  constructor(props) {
    super(props);
    this.state = {
    	name: "PlaceFormArea"
    }
  }

  render() {
  	let placeArray = [];
  	let i = 1;
  	for(let key in this.props.places){
  		placeArray.push(
  			<PlaceForm key={key} placeId={key} 
	  			place={this.props.places[key]} number={i} 
	  			handlePlaceDelete={this.props.handlePlaceDelete} 
	  			handlePlaceChange={this.props.handlePlaceChange} 
	  			isPlaceValid={this.props.isPlaceValid}
  			/>
  		)
  		i++;
  	}

    return (
      <div>
      	<div id='placeArea'>
      	{placeArray}
      	</div>
        <div className='row left-lg'>
          <div className="col-xs-12">
          	<FlatButton
				      label="Add Place"
				      icon={<IconAddPlace />}
				      onTouchTap={this.props.handleAddPlace}
				    />
          </div>
        </div>
      </div>
    );
  }
}
