import React, { Component } from 'react';
import {grey700, indigo500} from 'material-ui/styles/colors';

import Helper from '../utils/Helper';
import * as firebase from 'firebase';

class PlaceView extends Component {
	constructor(props) {
    super(props);
    this.state = {
    	name: '',
    	address: '',
    	price: '',
    	tel: '',
    	website: ''
    }
  }

  componentDidMount() {
  	firebase.database().ref(this.props.place).once("value", (snap) => {
      let place = snap.val()      
      let price = '';
      if(place.price) price = Helper.makeMoneyReadable(parseFloat(place.price));
      this.setState({
	    	name: place.name,
	    	address: place.address,
	    	price: price,
	    	tel: place.tel,
	    	website: place.website
	    })
    });
  }

	render() {
		return (
			<div>				
				<div style={{borderTop: '1px solid #eee', padding: 16}}>
          <div style={{fontWeight: 500}}>{this.state.name} <span style={{float: 'right', color: indigo500}}>{this.state.price}</span></div>
          <div style={{color: grey700}}>{this.state.address}</div>
          <div>Tel: {this.state.tel} - Website: {this.state.website}</div>
        </div>
			</div>
		);
	}
}

export default PlaceView;		