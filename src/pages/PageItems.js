import React, { Component } from 'react';
import ItemContainer from '../containers/ItemContainer';

class PageItem extends Component {
	constructor(props) {
    super(props);
  }

	render() {
		return (
			<div className="MainContent" style={{marginLeft: 256, padding: 20}}>
        <ItemContainer />
      </div>
		);
	}
}

export default PageItem;