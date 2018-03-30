import React from 'react';
import CountryContainer from '../containers/CountryContainer';
import CityContainer from '../containers/CityContainer';
import Divider from 'material-ui/Divider';

const PageLocation = () => (
			<div className="MainContent" style={{marginLeft: 256, padding: 20}}>
        <CountryContainer />
        <Divider style={{marginTop: 20, marginBottom: 20}} />        
        <CityContainer />
      </div>			
		);

export default PageLocation;