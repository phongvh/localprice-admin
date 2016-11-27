import React, { Component } from 'react';
import ItemFilter from '../components/ItemFilter';

class PageItem extends Component {
	constructor(props) {
    super(props);
  }

	render() {
		return (
			<div className="MainContent" style={{marginLeft: 256, padding: 20}}>
        <ItemFilter />
      </div>
		);
	}
}

export default PageItem;