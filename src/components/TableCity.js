import React from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn}
  from 'material-ui/Table';
import * as firebase from 'firebase';
import ActionsPanel from './ActionsPanel';

const styles = {
  propContainer: {
    width: 200,
    overflow: 'hidden',
    margin: '20px auto 0',
  },
  propToggleHeader: {
    margin: '20px auto 10px',
  },
  tableHead: {
    color: '#333', fontSize: 14, fontWeight: 500
  }
};

class TableCity extends React.Component {

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
            {this.props.tableData.map( (row, index) => (
              <TableRow key={index} selected={row.selected} style={{color: '#333'}}>
                <TableRowColumn><img src={row.image} width="40" height="40" /></TableRowColumn>
                <TableRowColumn style={{fontSize: 15, fontWeight: 500}}>{row.name}</TableRowColumn>
                <TableRowColumn style={{fontSize: 15}}>{row.currency}</TableRowColumn>
                <TableRowColumn style={{fontSize: 15}}>{row.created}</TableRowColumn>
                <TableRowColumn style={{fontSize: 15}}>
                  <ActionsPanel itemKey={row.cityKey} handleDelete={this.props.handleDelete} handleEdit={this.props.handleEdit} />
                </TableRowColumn>
              </TableRow>
            ))}
          </TableBody>          
        </Table>
      </div>
    );
  }
}

export default TableCity;