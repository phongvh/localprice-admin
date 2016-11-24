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
				<AppBar title="LocalPrice Admin" style={{position: 'fixed', top: 0}}/> 
	      <div className="mainContainer" style={{marginTop: 70}}>
	        <DrawerCom currentPage={this.props.location.pathname} />
	        {this.props.children}
	      </div>
      </div>
		);
	}
}

export default _Frame;