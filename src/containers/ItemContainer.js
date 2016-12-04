import React, { Component } from 'react';
import TextField from 'material-ui/TextField';

import RaisedButton from 'material-ui/RaisedButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import {pink300, grey400} from 'material-ui/styles/colors';
import SelectField from 'material-ui/SelectField';
import IconSearch from 'material-ui/svg-icons/action/search';
import IconAdd from 'material-ui/svg-icons/content/add-circle';
import CircularProgress from 'material-ui/CircularProgress';

import Alert from '../components/Alert';
import ItemTable from '../components/ItemTable';
import AddItemDialog from '../components/AddItemDialog';
import ViewItemDialog from '../components/ViewItemDialog';
import Helper from '../utils/Helper';

import * as firebase from 'firebase';

const styles = {	
	search: {
		boxShadow: 'rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px',
		height: 56,		
		margin: '8px 0',
		backgroundColor: 'white',
	},
	inputSearch: {
		paddingLeft: 48,
		paddingRight: 16,
		marginTop: 0,
	},
	searchLabel: {
		float: 'left',
		marginLeft: 16,
	},
	underline: {
		display: 'none'
	},
	clabel: {
		fontWeight: 'bold', 
		fontSize: 20,
		marginLeft: 24,
		marginTop: 4,
		color: pink300
	},
	label: {
		fontWeight: 'bold', 
		fontSize: 18,
		marginLeft: 24,
		marginTop: 4,
		opacity: 0.6
	},
	iconStyle: {
		paddingRight: 16,
	},
	selectfield: {
		margin: '8px 0',		
		height: 56,
		backgroundColor: 'white',
    boxShadow: 'rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px'
	},
	button: {
		margin: '24px 0',
		height: 40,
	}
};

class ItemContainer extends Component {
	constructor(props) {
    super(props);

    this.state = {
    	cityArray: [],
    	catArray: [],
    	city: '',
    	category: '',
    	categoryName: '',
    	itemArray: [],
    	search: '',
    	notValid: true,
    	addItemOpen: false,
      addBtnDisabled: true,
    	snackOpen: false,
      snackMessage: '',
      isSending: false,
      isSent: false,
      deleteDialogOpen: false,
      deleteKey: '',
      editMode: false,
      editItem: '',      
      viewItemOpen: false,
      viewMode: false,
      viewItem: ''
    }

    this.timer = undefined;
    this.startTimer = 0;
    this.listener = undefined;
    this.cityRef = firebase.database().ref('city');
    this.catRef = firebase.database().ref('category');
    this.itemRef = firebase.database().ref('item');
    this.defautCity = '';
    this.defaultCategory = '';
    this.snapCat = '';
    
  }

  componentDidMount() {
    this.cityRef.once('value' , snap => {    	
      let data = [];
      let itemsList = snap.val();
      Object.keys(itemsList).map((itemKey) => {
        itemsList[itemKey].key = itemKey;
        data.push(itemsList[itemKey]);
        return null;
      });
      this.defaultCity = data[0].key;
      this.setState({cityArray: data, city: this.defaultCity})
      this.catRef.once('value' , snap => {
	      let data = [];
	      let itemsList = this.snapCat = snap.val();
	      Object.keys(itemsList).map((itemKey) => {
	        itemsList[itemKey].key = itemKey;
	        data.push(itemsList[itemKey]);
	        return null;
	      });
	      this.defaultCategory = data[0];
	      this.setState({catArray: data, category: this.defaultCategory.key, categoryName: this.defaultCategory.name, addBtnDisabled: false})
	      
	      const subItemRef = this.itemRef.child(this.state.city).child(this.state.category);
	    	this.listener = subItemRef.on('value' , snap => {
		      let data = [];
		      let itemsList = snap.val();
		      Object.keys(itemsList).map((itemKey) => {
		      	itemsList[itemKey].key = itemKey;
		        data.push(itemsList[itemKey]);
		        return null;
		      });
		      this.setState({itemArray: data.reverse()})
		      Helper.hideLoading()
		    });
	    });
    });
  }

  componentWillUnmount() {
    if(typeof this.listener === "object"){
      this.listener.off();
    }
  }

  componentDidUpdate(prevProps, prevState) {

    /*Helper.checkSync(this);

    if(this.state.name && this.state.icon && this.state.notValid){      
      this.setState({
          notValid: false
        });
    }    */
    
  }

  handleChange = (event) => {
    if(event.target.name === 'search'){      
      this.setState({
        search: event.target.value
      });
    }
  }

  handleCityChange = (event, index, value) => {
  	Helper.showLoading()
    this.setState({city: value});
    const subItemRef = this.itemRef.child(value).child(this.state.category);
    this.listener = subItemRef.on('value' , snap => {
      let data = [];
      let itemsList = snap.val();
      Object.keys(itemsList).map((itemKey) => {
      	itemsList[itemKey].key = itemKey;
        data.push(itemsList[itemKey]);
        return null;
      });
      this.setState({itemArray: data.reverse()})
      Helper.hideLoading()
    });
  }

  handleCategoryChange = (event, index, value) => {
  	Helper.showLoading()
    this.setState({category: value, categoryName: this.snapCat[value].name});

    const subItemRef = this.itemRef.child(this.state.city).child(value);
    this.listener = subItemRef.on('value' , snap => {
      let data = [];
      let itemsList = snap.val();
      Object.keys(itemsList).map((itemKey) => {
      	itemsList[itemKey].key = itemKey;
        data.push(itemsList[itemKey]);
        return null;
      });
      this.setState({itemArray: data.reverse()})
      Helper.hideLoading()
    });
  }

  handlePreAddItem = () => {
  	this.setState({addItemOpen: true});
  }

  handleAddItem = (isAdded) => {  	
  	if(!isAdded){
  		this.setState({
	      addItemOpen: false,
	      snackMessage: 'Failed connecting to server',
        snackOpen: true,
	    })
  	}else{
  		this.setState({
	      addItemOpen: false,
	      snackMessage: 'New item added',
        snackOpen: true,
	    })
  	}
  }

  handleAddItemClose = () => {
    this.setState({
      addItemOpen: false,
      editMode: false,
      editItem: ''
    })
  }

  handlePreEdit = (itemKey) => {
    this.itemRef.child(this.state.city).child(this.state.category).child(itemKey).once("value", (snap) => {
      const item = snap.val()
      item.key = itemKey
//      let places = item.place;      
      
      this.setState({
        editMode: true,
        editItem: item,
        addItemOpen: true
      })
    });
    
  }

  handleEditItem = (isEdited) => {    
    if(!isEdited){
      this.setState({
        addItemOpen: false,
        snackMessage: 'Failed connecting to server',
        snackOpen: true,
        editMode: false,
        editItem: ''
      })
    }else{
      this.setState({
        addItemOpen: false,
        snackMessage: 'Item updated',
        snackOpen: true,
        editMode: false,
        editItem: ''
      })
    }
  }

  handlePreDelete = (itemKey) => {
    this.setState({
        deleteDialogOpen: true,
        deleteKey: itemKey
      })
  }

  handleDelete = () => {
    if(this.state.deleteKey)
      this.itemRef.child(this.state.city).child(this.state.category).child(this.state.deleteKey).remove().then((function() {
        firebase.database().ref('statistic/item').once('value', (snap) => {
          let itemStat = snap.val();
          itemStat.total = itemStat.total - 1;
          //itemStat[this.state.city].total = itemStat[this.state.city].total ? itemStat[this.state.city].total + 1 : 1;
          //const catTotal = itemStat[this.state.city][this.state.category]
          //itemStat[this.state.city][this.state.category] = catTotal ? catTotal + 1 : 1;
          firebase.database().ref('statistic/item').update(itemStat);
        })
        this.setState({
          snackMessage: 'Delete succeeded',
          snackOpen: true
        })
      }).bind(this))
      .catch((function(error) {
        this.setState({
          snackMessage: "Remove failed: " + error.message,
          snackOpen: true
        })
      }).bind(this));

    this.setState({
      deleteDialogOpen: false,
      deleteKey: ''
    })
  }

  handleView = (itemKey) => {
    this.itemRef.child(this.state.city).child(this.state.category).child(itemKey).once("value", (snap) => {
      const item = snap.val()
      item.key = itemKey
      this.setState({
        viewMode: true,
        viewItem: item,
        viewItemOpen: true
      })
    });
    
  }

  handleViewItemClose = () => {
    this.setState({
      viewItemOpen: false,
      viewMode: false,
      viewItem: ''
    })
  }  

  handleDialogClose = () => {
    this.setState({
          deleteDialogOpen: false,
          deleteKey: ''
        })
  }

  snackClose = (reason) => {
    this.setState({
            snackMessage: '',
            snackOpen: false,
          });
  }

	render() {
		return (
			<div>				
        <div className='row top-lg'>
        	<div className="col-xs-12 col-lg-3">
            <SelectField name="city"
		          value={this.state.city} onChange={this.handleCityChange} 
		          underlineStyle={styles.underline} labelStyle={styles.clabel} 
		          style={styles.selectfield} iconStyle={styles.iconStyle} fullWidth={true}
		        >
              {this.state.cityArray.map( (row, index) => (
                <MenuItem key={row.key} value={row.key} primaryText={row.name} />
              ))}
            </SelectField>
        	</div>
          <div className="col-xs-12 col-lg-6">
          	<TextField name="search" value={this.state.search} floatingLabelText={<IconSearch style={{opacity: 0.5}} />}
          	fullWidth={true} onChange={this.handleChange} floatingLabelStyle={styles.searchLabel}
          	underlineShow={false} style={styles.search} inputStyle={styles.inputSearch}
          	floatingLabelFixed={true} />
          </div>
          <div className="col-xs-12 col-lg-3">
          	<SelectField name="category"
		          value={this.state.category} onChange={this.handleCategoryChange} 
		          underlineStyle={styles.underline} labelStyle={styles.label} 
		          style={styles.selectfield} iconStyle={styles.iconStyle} fullWidth={true}
		        >
          		{this.state.catArray.map( (row, index) => (
                <MenuItem key={row.key} value={row.key} primaryText={row.name} />
              ))}
        		</SelectField>
          </div>
        </div>
        
        <div className='row bottom-lg end-lg'>

	        <div className="col-xs-12 col-lg-3">
	        	<RaisedButton label='New Item' onTouchTap={this.handlePreAddItem} disabled={this.state.addBtnDisabled}
	        	secondary={true} style={styles.button} icon={<IconAdd />} />
	        </div>
        </div>

        <ItemTable itemArray={this.state.itemArray} categoryName={this.state.categoryName}
         handleDelete={this.handlePreDelete} handleEdit={this.handlePreEdit} handleView={this.handleView}/>

        <div className='row' style={{marginTop:24}}>
        	<CircularProgress id="loadingAction" color={grey400} size={30} style={{margin: '0 auto'}}/>
        </div>
        <AddItemDialog state={this.state} handleAddItem={this.handleAddItem} handleEditItem={this.handleEditItem} handleAddItemClose={this.handleAddItemClose} /> 
        <ViewItemDialog state={this.state} handleViewItemClose={this.handleViewItemClose} /> 
        <Alert 
          title="Delete item"
          state={this.state} 
          handleDialogClose={this.handleDialogClose}
          handleDelete={this.handleDelete}
          snackClose={this.snackClose}
        />
			</div>
		);
	}
}

export default ItemContainer;