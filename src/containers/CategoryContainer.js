import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import Alert from '../components/Alert';
import TableCategory from '../components/TableCategory';
import Helper from '../utils/Helper';

import * as firebase from 'firebase';

class CategoryContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: [],
      name: '',
      icon: '',
      iconStoragePath: '',
      errorName: '',
      errorCurrency: '',
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
    this.listener = undefined;
    this.fileStorage = firebase.storage().ref('category');
    this.dbRef = firebase.database().ref('category');
  }

  componentDidMount() {
    this.listener = this.dbRef.on('value' , snap => {
      let tableData = [];
      let itemsList = snap.val();
      Object.keys(itemsList).map((itemKey) => {
        itemsList[itemKey].catKey = itemKey;
        tableData.push(itemsList[itemKey]);
        return null;
      });
      this.setState({tableData: tableData.reverse()})
      Helper.hideLoading()
    });
  }

  componentWillUnmount() {
    if(typeof this.listener === "object"){
      this.listener.off();
    }
  }

  componentDidUpdate(prevProps, prevState) {

    Helper.checkSync(this);

    if(this.state.name && this.state.icon && this.state.notValid){      
      this.setState({
          notValid: false
        });
    }    
    
  }

  handleChange = (event) => {
    
    if(event.target.name === 'catName') {
      if(event.target.value)
        this.setState({
          name: event.target.value,
          errorName: ''
        });
      else {

        this.setState({
          name: '',
          errorName: 'Category name is required',
          notValid: true
        });
      }
    }else if(event.target.name === 'catIcon'){
      let file = event.target.files[0];
      let fileRef = this.fileStorage.child(file.name);
      let task = fileRef.put(file).then((snap) => {
        document.getElementById("imagePreview").innerHTML = "<img src='" + snap.downloadURL + "' width='40' height='40' />";
        this.setState({
          icon: snap.downloadURL,
          iconStoragePath: snap.metadata.fullPath
        });
      });
    }
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

  render() {
    
    return (
      <div style={{textAlign: 'left', padding: 20, background: 'white', border: '1px solid #ddd', marginBottom: 10}}>
        <div className='_dark-heading'> Category </div> 
        <div className='row top-lg'>
          <div className="col-xs-12 col-lg-3 _dark-title">{this.state.editMode ? 'Edit Category:' : 'Add new category:'}</div>           
          <div className="col-xs-12 col-lg-2">
            <TextField floatingLabelText="Name" name="catName" value={this.state.name} 
            errorText={this.state.errorName} fullWidth={true} onChange={this.handleChange} />
          </div>          
          <div className="col-xs-12 col-lg-7">
            <div style={{marginTop:24}}>
              <div className="_dark-body1 grey400">Category icon:</div> 
              <input name="catIcon" id="catIcon" onChange={this.handleChange} type="file" />
              <div id="imagePreview"></div>
            </div>
          </div>
        </div>
        <div style={{marginTop: 10, marginBottom: '20px'}}><RaisedButton disabled={this.state.notValid} label={this.state.editMode ? 'Save' : 'Add Category'} primary={true} onTouchTap={this.handleSubmit} /></div>
        <TableCategory tableData={this.state.tableData} handleDelete={this.handlePreDelete} handleEdit={this.handlePreEdit} />
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

export default CategoryContainer;