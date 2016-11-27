import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import ItemTable from './ItemTable';
import RaisedButton from 'material-ui/RaisedButton';
import * as firebase from 'firebase';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Alert from './Alert';
import AddItemDialog from './AddItemDialog';
import Helper from '../utils/Helper';
import Paper from 'material-ui/Paper';
import {pink300, grey400} from 'material-ui/styles/colors';
import SelectField from 'material-ui/SelectField';
import IconSearch from 'material-ui/svg-icons/action/search';
import IconAdd from 'material-ui/svg-icons/content/add-circle';
import CircularProgress from 'material-ui/CircularProgress';

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

const showLoading = () => {
	document.getElementById("loadingAction").style.display = 'block'
}

const hideLoading = () => {
	document.getElementById("loadingAction").style.display = 'none'
}

class ItemFilter extends Component {
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
    	snackOpen: false,
      snackMessage: '',
      isSending: false,
      isSent: false,
      deleteDialogOpen: false,
      deleteKey: '',
      editMode: false,
      editItem: ''
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
      this.defaultCity = data.reverse()[0].key;
      this.setState({cityArray: data, city: this.defaultCity})
      this.catRef.once('value' , snap => {
	      let data = [];
	      let itemsList = this.snapCat = snap.val();
	      Object.keys(itemsList).map((itemKey) => {
	        itemsList[itemKey].key = itemKey;
	        data.push(itemsList[itemKey]);
	        return null;
	      });
	      this.defaultCategory = data.reverse()[0];
	      this.setState({catArray: data, category: this.defaultCategory.key, categoryName: this.defaultCategory.name})
	      
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
		      hideLoading()
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
    this.setState({city: value});
  }

  handleCategoryChange = (event, index, value) => {
  	showLoading()
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
      hideLoading()
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

  handleAddItem = (isEdited) => {  	
  	if(!isEdited){
  		this.setState({
	      addItemOpen: false,
	      snackMessage: 'Failed connecting to server',
        snackOpen: true,
	    })
  	}else{
  		this.setState({
	      addItemOpen: false,
	      snackMessage: 'Item updated',
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
      this.setState({
        editMode: true,
        editItem: item,
        addItemOpen: true
      })
    });
    
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
  };

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
	        	<RaisedButton label='New Item' onTouchTap={this.handlePreAddItem} 
	        	secondary={true} style={styles.button} icon={<IconAdd />} />
	        </div>
        </div>

        <ItemTable itemArray={this.state.itemArray} categoryName={this.state.categoryName}
         handleDelete={this.handlePreDelete} handleEdit={this.handlePreEdit} />

        <div className='row' style={{marginTop:24}}>
        	<CircularProgress id="loadingAction" color={grey400} size={30} style={{margin: '0 auto'}}/>
        </div>
        <AddItemDialog state={this.state} handleAddItem={this.handleAddItem} handleAddItemClose={this.handleAddItemClose} /> 
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

export default ItemFilter;