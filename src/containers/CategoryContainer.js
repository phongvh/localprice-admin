import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import Alert from '../components/Alert';
import TableCategory from '../components/TableCategory';
import Helper from '../utils/Helper';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as categoryActions from '../actions/categoryActions';

import * as firebase from 'firebase';

class CategoryContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: {name: '', res_id: '', order: ''},
      error: {name: '', res_id: '', order: ''},
      notValid: true,
      snackOpen: false,
      snackMessage: '',
      isSending: false,
      isSent: false,
      deleteDialogOpen: false,
      deleteKey: '',
      editMode: false,
      editKey: ''
    }
    this.timer = undefined;
    this.startTimer = 0;
    this.fileStorage = firebase.storage().ref('category');
    this.dbRef = firebase.database().ref('category');
  }
  
  componentWillReceiveProps(nextProps) {
    if (this.props.categories !== nextProps.categories) {      
      this.setState({category: {...this.state.category, order: nextProps.categories.length}});
    }
  }

  componentDidUpdate(prevProps, prevState) {

    Helper.checkSync(this);

    if(this.state.category.name && this.state.category.res_id && this.state.category.order && this.state.notValid){      
      this.setState({
          notValid: false
        });
    }    
    
  }

  validateForm = (event) => {
    const error = this.state.error;

    const reqField = [
      {name: 'name', message: 'Category Name is required'},
      {name: 'res_id', message: 'Icon Location is required'},
      {name: 'order', message: 'Order is required'}
    ]

    reqField.forEach((field) => {
      if(event.target.name === field.name) {
        if(event.target.value) {  
          error[field.name] = ''
          this.setState({error})
        }else{
          error[field.name] = field.message
          this.setState({error, notValid: true})
        }
      }
    })
  }

  handleChange = (event) => {
    this.validateForm(event)

    if(event.target.name === 'order'){
      event.target.value = Helper.formatNumber(event.target.value)
    }

    let category = this.state.category;
    category[event.target.name] = event.target.value
    this.setState({
      category
    });
  };

  /*handleChange = (event) => {
    
    if(event.target.name === 'catIcon'){
      let file = event.target.files[0];
      if(file.type.toLowerCase() !== 'image/png' && file.type.toLowerCase() !== 'image/jpeg'){
        alert('Error: A png or jpeg file is required');
        event.target.value = null;
        return false;
      }
      let fileRef = this.fileStorage.child(file.name);
      let task = fileRef.put(file).then((snap) => {
        document.getElementById("imagePreview").innerHTML = "<img src='" + snap.downloadURL + "' width='40' height='40' />";
        this.setState({
          icon: snap.downloadURL,
          iconStoragePath: snap.metadata.fullPath
        });
      });
    }
  }*/

  handlePreEdit = (categoryId) => {
    let category = {name:'', country_code: ''}
    if (categoryId && this.props.categories.length > 0) {
      category = Helper.getObjectById(this.props.categories, categoryId);
    }
    this.setState({
      category
    })
    
  }

  handlePreEdit = (catKey) => {
    this.dbRef.child(catKey).once("value", (snap) => {
      const cat = snap.val()
      document.getElementById("imagePreview").innerHTML = "<img src='" + cat.icon + "' width='40' height='40' />";
      this.setState({
        name: cat.name,
        icon: cat.icon,
        iconStoragePath: cat.icon_path,
        editMode: true,
        editKey: catKey
      })
    });
    
  }

  handlePreDelete = (catKey) => {
    this.setState({
        deleteDialogOpen: true,
        deleteKey: catKey
      })
  }

  handleDelete = () => {
    Helper.deleteItem(this);
  };

  handleDialogClose = () => {
    this.setState({
          deleteDialogOpen: false,
          deleteKey: ''
        })
  };

  snackClose = (reason) => {
    this.setState({
            snackMessage: '',
            snackOpen: false,
          });
  }

  handleSubmit = () => {
    if(this.state.name && this.state.icon){
      this.setState({
              isSending: true,
              isSent: false
            });

      if(this.state.editMode){
        this.dbRef.child(this.state.editKey).update({
          name: this.state.name, 
          icon: this.state.icon,
          icon_path: this.state.iconStoragePath,
          updated: firebase.database.ServerValue.TIMESTAMP
        },
        (error) => {
            
          if(error){            
            this.setState({
              snackMessage: 'Failed connecting to server',
              snackOpen: true,
            });
          }else{
            document.getElementById("imagePreview").innerHTML = '';
            document.getElementById("catIcon").value = null;
            this.setState({
              name: '',
              icon: '',
              iconStoragePath: '',
              errorName: '',
              errorCode: '',
              notValid: true,
              snackMessage: 'Category updated',
              snackOpen: true,
              isSending: false,
              isSent: true,
              editMode: false,
              editKey: ''
            })
          }
        });
      }else{
        this.dbRef.push(
          { 
            name: this.state.name, 
            icon: this.state.icon,
            icon_path: this.state.iconStoragePath,
            created: firebase.database.ServerValue.TIMESTAMP 
          },
          (error) => {
            
            if(error){            
              this.setState({
                snackMessage: 'Failed connecting to server',
                snackOpen: true,
              });
            }else{
              document.getElementById("imagePreview").innerHTML = '';
              document.getElementById("catIcon").value = null;
              this.setState({
                name: '',
                icon: '',
                iconStoragePath: '',
                errorName: '',
                errorCode: '',
                notValid: true,
                snackMessage: 'New category added',
                snackOpen: true,
                isSending: false,
                isSent: true
              })
            }
          }
        );
      }  
    }else{
      this.setState({
        notValid: true
      })
    }
  }

  render() {
    
    return (
      <div style={{textAlign: 'left', padding: 20, background: 'white', border: '1px solid #ddd', marginBottom: 10}}>
        <div className='_dark-heading'> Category </div> 
        <div className='row top-lg'>
          <div className="col-xs-12 col-lg-3 _dark-title">{this.state.category.id ? 'Edit Category:' : 'Add new category:'}</div>           
          <div className="col-xs-12 col-lg-2">
            <TextField floatingLabelText="Name" name="name" value={this.state.category.name} 
            errorText={this.state.error.name} fullWidth={true} onChange={this.handleChange} />
          </div>          
          <div className="col-xs-12 col-lg-2">
            <TextField floatingLabelText="Icon Location" name="res_id" value={this.state.category.res_id} 
            errorText={this.state.error.res_id} fullWidth={true} onChange={this.handleChange} />
          </div>
          <div className="col-xs-12 col-lg-2">
            <TextField floatingLabelText="Order" name="order" value={this.state.category.order} 
            errorText={this.state.error.order} fullWidth={true} onChange={this.handleChange} />
          </div>
        </div>
        <div style={{marginTop: 10, marginBottom: '20px'}}><RaisedButton disabled={this.state.notValid} label={this.state.category.id ? 'Save' : 'Add Category'} primary={true} onTouchTap={this.handleSubmit} /></div>
        <TableCategory tableData={this.props.categories} handleDelete={this.handlePreDelete} handleEdit={this.handlePreEdit} />
        <Alert 
          title="Delete category"
          state={this.state} 
          handleDialogClose={this.handleDialogClose}
          handleDelete={this.handleDelete}
          snackClose={this.snackClose}
        />
      </div>
      
    );
  }
}

function mapStateToProps(state, ownProps) {
  //debugger;
  return {
    categories: state.categories
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(categoryActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryContainer);