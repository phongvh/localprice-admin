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
    color: '#333',
    fontSize: 14,
    fontWeight: 500
  }
};

class TableCountry extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      tableData: []
    };
  }

  componentDidMount() {
    const countryRef = firebase.database().ref().child('country');
    countryRef.on('value' , snap => {
      let tableData = [];
      let itemsList = snap.val();
      Object.keys(itemsList).map((itemKey) => {
        tableData.push(itemsList[itemKey]);
      });
      this.setState({tableData: tableData.reverse()})
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
              <TableHeaderColumn>Name</TableHeaderColumn>
              <TableHeaderColumn>Code</TableHeaderColumn>
              <TableHeaderColumn>Updated</TableHeaderColumn>
              <TableHeaderColumn>Action</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={false}
          >
            {this.state.tableData.map( (row, index) => (
              <TableRow key={index} selected={row.selected} style={{fontSize: 20, color: '#333'}}>
                <TableRowColumn style={{fontSize: 15, fontWeight: 500}}>{row.name}</TableRowColumn>
                <TableRowColumn style={{fontSize: 15}}>{row.country_code}</TableRowColumn>
                <TableRowColumn style={{fontSize: 15}}>{row.created}</TableRowColumn>
                <TableRowColumn style={{fontSize: 15}}>action</TableRowColumn>
              </TableRow>
              ))}
          </TableBody>          
        </Table>
      </div>
    );
  }
}

export default TableCountry;