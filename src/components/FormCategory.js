import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import TableCategory from './TableCategory';
import RaisedButton from 'material-ui/RaisedButton';
import * as firebase from 'firebase';
import Snackbar from 'material-ui/Snackbar';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {red400, pink50} from 'material-ui/styles/colors';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    display: 'flex',
    flexWrap: 'nowrap'
  },
  titleStyle: {
    color: 'rgb(0, 188, 212)',
  },
};
class FormCategory extends Component {
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
  }

  componentDidMount() {
    const catRef = firebase.database().ref().child('category');
    this.listener = catRef.on('value' , snap => {
      let tableData = [];
      let itemsList = snap.val();
      Object.keys(itemsList).map((itemKey) => {
        itemsList[itemKey].catKey = itemKey;
        tableData.push(itemsList[itemKey]);
      });
      this.setState({tableData: tableData.reverse()})
    });
  }

  componentWillUnmount() {
    if(typeof this.listener === "object"){
      this.listener.off();
    }
  }

  componentDidUpdate(prevProps, prevState) {

    const sendingCheck = () => {
      this.timer = setTimeout(() => {        
        console.log("Check sending...");
        if((Date.now() - this.startTimer) > 8000){
          this.setState({
              snackMessage: 'Failed connecting to server! Reloading this page...',
              snackOpen: true,
            });
        }
        if((Date.now() - this.startTimer) > 10000){
          this.startTimer = 0;
          clearTimeout(this.timer);
          if(typeof this.listener === "object"){
            this.listener.off();
          }
          //location.reload();
        }else{
          sendingCheck();
        }
      }, 1500);
    }

    if(this.state.isSent){
      this.setState({
          isSent: false,
        });
      console.log("timer cleared");      
      this.startTimer = 0;
      clearTimeout(this.timer);
    }

    if(this.state.isSending){
      if(!this.startTimer){
        this.startTimer = Date.now();
        sendingCheck(); 
      }    
    }  
    
    if(this.state.slackOpen){
      this.setState({
          snackOpen: false,
          snackMessage: ''
        });
    }

    if(this.state.name && this.state.icon && this.state.notValid){      
      this.setState({
          notValid: false
        });
    }    
    
  }

  handleChange = (event, index, value) => {
    
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
    }else if(event.target.name == 'catIcon'){
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
        firebase.database().ref().child('category').child(this.state.editKey).update({
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
        firebase.database().ref().child('category').push(
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
    firebase.database().ref().child('category').child(catKey).once("value", (snap) => {
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
    if(this.state.deleteKey)
      firebase.database().ref().child('category').child(this.state.deleteKey).remove().then((function() {
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
  };

  snackClose = (reason) => {
    this.setState({
            snackMessage: '',
            snackOpen: false,
          });
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={false}
        onTouchTap={this.handleDialogClose}
        style={{margin:16, marginRight:8}}
      />,
      <RaisedButton
        label="Delete"
        labelColor="white"
        backgroundColor={red400}
        onTouchTap={this.handleDelete}
        style={{margin:16, marginLeft:8}}
      />,
    ];

    return (
      <div style={{textAlign: 'left', padding: 20, background: 'white', border: '1px solid #ddd', marginBottom: 10}}>
        <div className='_dark-heading'> Category </div> 
        <div className='row top-lg'>
          <div className="col-xs-12 col-lg-3 _dark-title">{this.state.editMode ? 'Edit Category:' : 'Add new category:'}</div>           
          <div className="col-xs-12 col-lg-2"><TextField floatingLabelText="Name" name="catName" value={this.state.name} errorText={this.state.errorName} fullWidth={true} onChange={this.handleChange} /></div>          
          <div className="col-xs-12 col-lg-7"><div style={{marginTop:24}}><div className="_dark-body1 grey400">Category icon:</div> <input name="catIcon" id="catIcon" onChange={this.handleChange} type="file" /><div id="imagePreview"></div></div></div>
        </div>
        <div style={{marginTop: 10, marginBottom: '20px'}}><RaisedButton disabled={this.state.notValid} label={this.state.editMode ? 'Save' : 'Add Category'} primary={true} onTouchTap={this.handleSubmit} /></div>
        <TableCategory tableData={this.state.tableData} handleDelete={this.handlePreDelete} handleEdit={this.handlePreEdit} />
        <Snackbar
          open={this.state.snackOpen}
          message={this.state.snackMessage}
          autoHideDuration={3000}
          onRequestClose={this.snackClose}          
        />
        <Dialog
          title="Delete category"
          actions={actions}
          modal={false}
          open={this.state.deleteDialogOpen}
          onRequestClose={this.handleDialogClose}
          contentStyle={{maxWidth:450}}
          bodyStyle={{backgroundColor:pink50}}
        >
          <p className="red500">This action can not be undone. Becareful!</p>
        </Dialog>
      </div>
      
    );
  }
}

export default FormCategory;