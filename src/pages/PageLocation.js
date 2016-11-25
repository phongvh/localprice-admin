import React from 'react';
import FormAddCountry from '../components/FormAddCountry';
import FormAddCity from '../components/FormAddCity';
import Divider from 'material-ui/Divider';

const PageLocation = () => (
			<div className="MainContent" style={{marginLeft: 256, padding: 20}}>
        <FormAddCountry />
        <Divider style={{marginTop: 20, marginBottom: 20}} />        
        <FormAddCity />
      </div>			
		);

export default PageLocation;