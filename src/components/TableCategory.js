import React from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn}
  from 'material-ui/Table';
import ActionsPanel from './ActionsPanel';

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
              <TableHeaderColumn>Icon</TableHeaderColumn> 
              <TableHeaderColumn>Name</TableHeaderColumn>              
              <TableHeaderColumn>Created</TableHeaderColumn>
              <TableHeaderColumn>Action</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={false}
          >
            {this.props.tableData.map( (row, index) => (
              <TableRow key={index} selected={row.selected} style={{color: '#333'}}>
                <TableRowColumn><img alt={row.name} src={row.icon} width="40" height="40" /></TableRowColumn>
                <TableRowColumn style={{fontSize: 15, fontWeight: 500}}>{row.name}</TableRowColumn>
                <TableRowColumn style={{fontSize: 15}}>{row.created}</TableRowColumn>
                <TableRowColumn>
                  <ActionsPanel itemKey={row.catKey} handleDelete={this.props.handleDelete} handleEdit={this.props.handleEdit} />
                </TableRowColumn>
              </TableRow>
              ))}
          </TableBody>          
        </Table>
      </div>
    );
  }
}

export default TableCategory;