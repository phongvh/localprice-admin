import React, { Component } from 'react';
import FormAddCountry from '../components/FormAddCountry';
import FormAddCity from '../components/FormAddCity';
import TableCategory from '../components/TableCategory';
import Divider from 'material-ui/Divider';

class PageData extends Component {
	constructor(props) {
    super(props);
  }

	render() {
		return (


			<div className="MainContent" style={{marginLeft: 256, padding: 20}}>
        <FormAddCountry />
        <Divider style={{marginTop: 20, marginBottom: 20}} />        
        <FormAddCity />
        <Divider style={{marginTop: 20, marginBottom: 20}} />
        <TableCategory />
      </div>			
		);
	}
}

export default PageData;