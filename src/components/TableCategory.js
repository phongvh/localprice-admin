import React from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn}
  from 'material-ui/Table';
import ActionsPanel from './ActionsPanel';
import Helper from '../utils/Helper';
import {grey400} from 'material-ui/styles/colors';
import CircularProgress from 'material-ui/CircularProgress';

class TableCategory extends React.Component {

  render() {
    return (
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
              <TableHeaderColumn>Name</TableHeaderColumn>
              <TableHeaderColumn>Icon Location</TableHeaderColumn> 
              <TableHeaderColumn>Order</TableHeaderColumn>
              <TableHeaderColumn>Created</TableHeaderColumn>
              <TableHeaderColumn>Action</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={false}
          >
            {this.props.tableData.map( (row, index) => (
              <TableRow key={index} selected={row.selected} style={{color: '#333'}}>               
                <TableRowColumn style={{fontSize: 15, fontWeight: 500}}>{row.name}</TableRowColumn>
                <TableRowColumn>{row.res_id}</TableRowColumn>
                <TableRowColumn>{row.order}</TableRowColumn>
                <TableRowColumn style={{fontSize: 15}}>{Helper.formatDateTime(row.created)}</TableRowColumn>
                <TableRowColumn>
                  <ActionsPanel itemKey={row.catKey} handleDelete={this.props.handleDelete} handleEdit={this.props.handleEdit} />
                </TableRowColumn>
              </TableRow>
              ))}
          </TableBody>          
        </Table>
        <div className='row' style={{marginTop:24}}>
          <CircularProgress id="loadingAction" color={grey400} size={30} style={{margin: '0 auto', display: 'none'}}/>
        </div>
      </div>
    );
  }
}

export default TableCategory;