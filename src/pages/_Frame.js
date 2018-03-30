import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import DrawerCom from '../components/DrawerCom';

class _Frame extends Component {

	constructor(props) {
    super(props);
    this.state = {
    	currentPage: this.props.location.pathname
    }
  }

	render() {
		return (
			<div className="_Frame">    
				<AppBar title="LocalPrice Admin" style={{position: 'fixed', top: 0}} iconElementLeft={<img src="https://firebasestorage.googleapis.com/v0/b/localprice-cdd75.appspot.com/o/assets%2Flogo%2FICON-04.png?alt=media&token=a94cbcf2-b45d-4bed-956b-3420cb6a72d9" alt="logo" width="48" height="48" />} /> 
	      <div className="mainContainer" style={{marginTop: 70}}>
	        <DrawerCom currentPage={this.props.location.pathname} />
	        {this.props.children}
	      </div>
      </div>
		);
	}
}

export default _Frame;