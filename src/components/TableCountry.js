import React from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn}
  from 'material-ui/Table';
import ActionsPanel from './ActionsPanel';
import Helper from '../utils/Helper';

const TableCountry = (props) =>
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
            <TableHeaderColumn>Code</TableHeaderColumn>
            <TableHeaderColumn>Created</TableHeaderColumn>
            <TableHeaderColumn>Action</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody
          displayRowCheckbox={false}
        >
          {props.tableData.map( (row, index) => (
            <TableRow key={index} selected={row.selected} style={{fontSize: 20, color: '#333'}}>
              <TableRowColumn style={{fontSize: 15, fontWeight: 500}}>{row.name}</TableRowColumn>
              <TableRowColumn style={{fontSize: 15}}>{row.country_code}</TableRowColumn>
              <TableRowColumn style={{fontSize: 15}}>{Helper.formatDateTime(row.created)}</TableRowColumn>
              <TableRowColumn>
                <ActionsPanel itemKey={row.id} handleDelete={props.handleDelete} handleEdit={props.handleEdit} />
              </TableRowColumn>
            </TableRow>
            ))}
        </TableBody>          
      </Table>
    </div>

export default TableCountry;