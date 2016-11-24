import React, { Component } from 'react';
import TableItem from '../components/TableItem';

class Home extends Component {
	constructor(props) {
    super(props);
  }

	render() {
		return (
			<div className="MainContent" style={{marginLeft: 256, padding: 20}}>
        <TableItem />
      </div>
		);
	}
}

export default Home;