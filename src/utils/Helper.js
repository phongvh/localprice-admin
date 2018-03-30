const Helper = {
  checkSync:  (self) => {
    const sendingCheck = () => {
      self.timer = setTimeout(() => {        
        console.log("Check sending...");
        if((Date.now() - self.startTimer) > 8000){
          self.setState({
              snackMessage: 'Failed connecting to server! Reloading self page...',
              snackOpen: true,
            });
        }
        if((Date.now() - self.startTimer) > 10000){
          self.startTimer = 0;
          clearTimeout(self.timer);
          if(typeof self.listener === "object"){
            self.listener.off();
          }
          location.reload();
        }else{
          sendingCheck();
        }
      }, 1500);
    }

    if(self.state.isSent){
      self.setState({
          isSent: false,
        });
      console.log("timer cleared");      
      self.startTimer = 0;
      clearTimeout(self.timer);
    }

    if(self.state.isSending){
      if(!self.startTimer){
        self.startTimer = Date.now();
        sendingCheck(); 
      }    
    }  
    
    if(self.state.slackOpen){
      self.setState({
          snackOpen: false,
          snackMessage: ''
        });
    }
  },

  deleteItem: (self) => {
    if(self.state.deleteKey)
      self.dbRef.child(self.state.deleteKey).remove().then((function() {
        this.setState({
          snackMessage: 'Deleted',
          snackOpen: true
        })
      }).bind(self))
      .catch((function(error) {
        this.setState({
          snackMessage: "Delete action failed: " + error.message,
          snackOpen: true
        })
      }).bind(self));

    self.setState({
      deleteDialogOpen: false,
      deleteKey: ''
    })
  },

  showLoading: () => {
    document.getElementById("loadingAction").style.display = 'block'
  },

  hideLoading: () => {
    document.getElementById("loadingAction").style.display = 'none'
  },

  formatDate: (timestamp) => {
    const d = new Date(timestamp);
    return d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear();
  },

  formatDateTime: (timestamp) => {
    const d = new Date(timestamp);
    return d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear() 
    + ' ' + d.getHours() + ':' + d.getMinutes();
  },

  convertNewLine: (html) => {
    return html.replace(/(?:\r\n|\r|\n)/g, '<br />');
  },

  formatNumber: (number) => {
    if(!number) return number;
    number = number.toString().replace( /[^\d\.]/g, '');
    return number;
  },

  formatMoney: (number) => {
    if(!number) return number;
    number = number.toString().replace( /[^\d\.]/g, '');
    number = number.replace(/(\.)(\d*)(\.)/, '$1$2');
    if(number.indexOf('.') !== -1){
      let part = number.split('.');
      number = part[0].replace( /(\d)(?=(\d{3})+(?!\d))/g, '$1,') + '.' + part[1].replace(/(\d)\d(\d)/,'$1$2');
    }else 
      number = number.replace( /(\d)(?=(\d{3})+(?!\d))/g, '$1,')

    return number;
  },

  unFormatMoney: (number) => {
    if(!number) return number;
    return number.toString().replace( /[^\d\.]/g, '');
  },

  makeMoneyReadable: (number) => {
    if(!number) return number;
    number = number.toString();
    if(number.indexOf('.') !== -1){
      var part = number.split('.');
      if(part[0].length > 3) number = part[0]
      else return number;
    }
    
    if(number.length < 4) return number;
  
    if(number.length > 3 && number.length < 7){
      number = parseFloat(number)/1000;
      number = number.toString().replace(/\.(\d)(\d)(\d)*/,'\.$1$2');
      return number + 'K';
    }
    
    if(number.length > 6 && number.length < 10){
      number = parseFloat(number)/1000000;
      number = number.toString().replace(/\.(\d)(\d)(\d)*/,'\.$1$2');
      return number + 'M';
    } 
    
    if(number.length > 9){
      number = parseFloat(number)/1000000000;
      number = number.toString().replace(/\.(\d)(\d)(\d)*/,'\.$1$2');
      return number + 'B';
    } 
  },

  uniqueId: () => {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    };

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
           s4() + '-' + s4() + s4() + s4();
  },

  getObjectById: (objectArray, objectId) => {
    const object = objectArray.filter(object => object.id === objectId);
    if (object) return {...object[0]};
    return null;
  }
};

export default Helper;