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

class TableCategory extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      tableData: []
    };
  }

  componentDidMount() {
    const categoryRef = firebase.database().ref().child('category');
    categoryRef.on('value' , snap => {
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
              <TableHeaderColumn>Updated</TableHeaderColumn>
              <TableHeaderColumn>Action</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={false}
          >
            {this.state.tableData.map( (row, index) => (
              <TableRow key={index} selected={row.selected} style={{color: '#333'}}>
                <TableRowColumn><img src={row.icon} /></TableRowColumn>
                <TableRowColumn style={{fontWeight: 500}}>{row.name}</TableRowColumn>
                <TableRowColumn>{row.created}</TableRowColumn>
                <TableRowColumn>action</TableRowColumn>
              </TableRow>
              ))}
          </TableBody>          
        </Table>
      </div>
    );
  }
}

export default TableCategory;