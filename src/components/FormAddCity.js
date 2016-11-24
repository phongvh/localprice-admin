import React from 'react';
import TextField from 'material-ui/TextField';
import TableCity from './TableCity';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    display: 'flex',
    flexWrap: 'nowrap'
  },
  titleStyle: {
    color: 'rgb(0, 188, 212)',
  },
};

const FormAddCity = () => (
  <div style={{textAlign: 'left', padding: 20, background: 'white', border: '1px solid #ddd', marginBottom: 10}}>
    <div className='_dark-heading'> City </div> 
    <div className='row middle-lg'>
      <div className="col-xs-12 col-lg-3 _dark-title">Add new city: </div>
      <div className="col-xs-12 col-lg-3"><TextField floatingLabelText="Name" fullWidth={true} /></div>
      <div className="col-xs-12 col-lg-3"><TextField floatingLabelText="Currency" fullWidth={true} /></div>
      <div className="col-xs-12 col-lg-3"><TextField floatingLabelText="Country" fullWidth={true} /></div>
    </div>
    <div style={{marginBottom: '20px'}}><RaisedButton label="Add City" primary={true} /></div>
    <TableCity />
  </div>
);

export default FormAddCity;