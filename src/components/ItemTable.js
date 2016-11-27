import React from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn}
  from 'material-ui/Table';
import * as firebase from 'firebase';
import ActionPanelItem from './ActionPanelItem';
import Helper from '../utils/Helper';


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
    color: '#333', 
    fontSize: 14, 
    fontWeight: 500
  },
  tableHeadCenter: {
    color: '#333', 
    fontSize: 14, 
    fontWeight: 500,
    textAlign: 'center'
  }
};

class ItemTable extends React.Component {

  render() {
    return (
      <div>
        <Table style={{border: '1px solid #ddd', color: '#333'}}
          selectable={false}
          multiSelectable={false}
        >
          <TableHeader
            displaySelectAll={false}
            adjustForCheckbox={false}
            enableSelectAll={false}
          >
            <TableRow>
              <TableHeaderColumn colSpan="7" tooltip="Food & Drink" style={{fontSize: 20, paddingTop: 10, paddingBottom: 10, color: '#333'}}>
                {this.props.categoryName}
              </TableHeaderColumn>
            </TableRow>
            <TableRow>
              <TableHeaderColumn style={styles.tableHead}>Image</TableHeaderColumn>
              <TableHeaderColumn style={styles.tableHead}>Name</TableHeaderColumn>
              <TableHeaderColumn style={styles.tableHead}>Price</TableHeaderColumn>
              <TableHeaderColumn style={styles.tableHead}>Unit</TableHeaderColumn>
              <TableHeaderColumn style={styles.tableHead}>Price Range</TableHeaderColumn>
              <TableHeaderColumn style={styles.tableHead}>Updated</TableHeaderColumn>
              <TableHeaderColumn style={styles.tableHeadCenter}>Action</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={false}
          >
            {this.props.itemArray.map( (row, index) => (
              <TableRow key={index} selected={row.selected}>
                <TableRowColumn><img alt={row.name} src={row.image_small} width="80" height="80" /></TableRowColumn>
                <TableRowColumn style={{fontSize: 15, fontWeight: 500}}>{row.name_en}</TableRowColumn>
                <TableRowColumn style={{fontSize: 15}}>{row.price}</TableRowColumn>
                <TableRowColumn style={{fontSize: 15}} >{row.currency}/{row.unit}</TableRowColumn>
                <TableRowColumn style={{fontSize: 15}} >{row.price_min} - {row.price_max}</TableRowColumn>
                <TableRowColumn style={{fontSize: 15}}>{Helper.formatDateTime(row.updated)}</TableRowColumn>
                <TableRowColumn>
                  <ActionPanelItem itemKey={row.key} handleDelete={this.props.handleDelete} handleEdit={this.props.handleEdit} />
                </TableRowColumn>
              </TableRow>
              ))}
          </TableBody>          
        </Table>
      </div>
    );
  }
}

export default ItemTable;