import React from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn}
  from 'material-ui/Table';
import ActionsPanel from './ActionsPanel';
import Helper from '../utils/Helper';
import CircularProgress from 'material-ui/CircularProgress';
import {grey400} from 'material-ui/styles/colors';

const TableCity = (props) => 
      <div>
        <Table style={{color: '#333'}}
          selectable={false}
          multiSelectable={false}
        >
          <TableHeader
            displaySelectAll={false}
            adjustForCheckbox={false}
            enableSelectAll={false}
          >
            <TableRow>
              <TableHeaderColumn>Image</TableHeaderColumn>
              <TableHeaderColumn>Name</TableHeaderColumn>
              <TableHeaderColumn>Currency</TableHeaderColumn>
              <TableHeaderColumn>Created</TableHeaderColumn>
              <TableHeaderColumn>Action</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={false}
          >
            {props.cities.map( (row, index) => (
              <TableRow key={index} selected={row.selected} style={{color: '#333'}}>
                <TableRowColumn><img alt={row.name} src={row.image} width="40" height="40" /></TableRowColumn>
                <TableRowColumn style={{fontSize: 15, fontWeight: 500}}>{row.name}</TableRowColumn>
                <TableRowColumn style={{fontSize: 15}}>{row.currency}</TableRowColumn>
                <TableRowColumn style={{fontSize: 15}}>{Helper.formatDateTime(row.created)}</TableRowColumn>
                <TableRowColumn style={{fontSize: 15}}>
                  <ActionsPanel itemKey={row.id} handleDelete={props.handleDelete} handleEdit={props.handleEdit} />
                </TableRowColumn>
              </TableRow>
            ))}
          </TableBody>          
        </Table>
        <div className='row' style={{marginTop:24}}>
          <CircularProgress id="loadingAction" color={grey400} size={30} style={{margin: '0 auto', display: 'none'}}/>
        </div>
      </div>

export default TableCity;