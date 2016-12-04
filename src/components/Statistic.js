import React, { Component } from 'react';
import Subheader from 'material-ui/Subheader';
import * as firebase from 'firebase';

class Statistic extends Component {
	constructor(props) {
    super(props);
    this.state = {
    	itemStat: ''
    }
  }

  componentDidMount() {
  	firebase.database().ref('statistic/item').on('value', (snap) => {
  		this.setState({
  			itemStat: snap.val()
  		})
  	});
  }

	render() {
		return (
			<div>
				<Subheader>Statistics</Subheader>
        <span style={{marginLeft: 16}}>Total items: {this.state.itemStat.total || ''}</span>
			</div>
		);
	}
}

export default Statistic;