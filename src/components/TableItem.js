import React from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn}
  from 'material-ui/Table';
import * as firebase from 'firebase';

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

class TableItem extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      tableData: []
    };
  }

  componentDidMount() {
    const rootRef = firebase.database().ref().child('item');
    const speedRef = rootRef.child('BbxDGkkdjf-kf').child('AbxDGkkdjf-kd');
    speedRef.on('value' , snap => {
      let tableData = [];
      let itemsList = snap.val();
      Object.keys(itemsList).map((itemKey) => {
        tableData.push(itemsList[itemKey]);
      });
      this.setState({tableData: tableData})
    });
  }

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
              <TableHeaderColumn colSpan="3" tooltip="Food & Drink" style={{fontSize: 20, paddingTop: 10, paddingBottom: 10, color: '#333'}}>
                Food & Drink
              </TableHeaderColumn>
            </TableRow>
            <TableRow>
              <TableHeaderColumn style={styles.tableHead}>Name</TableHeaderColumn>
              <TableHeaderColumn style={styles.tableHead}>Price</TableHeaderColumn>
              <TableHeaderColumn style={styles.tableHead}>Updated</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={false}
          >
            {this.state.tableData.map( (row, index) => (
              <TableRow key={index} selected={row.selected}>
                <TableRowColumn style={{fontWeight: 500}}>{row.name_en}</TableRowColumn>
                <TableRowColumn >{row.price}</TableRowColumn>
                <TableRowColumn>{row.created}</TableRowColumn>
              </TableRow>
              ))}
          </TableBody>          
        </Table>
      </div>
    );
  }
}

export default TableItem;