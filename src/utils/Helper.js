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
          snackMessage: 'Delete succeeded',
          snackOpen: true
        })
      }).bind(self))
      .catch((function(error) {
        this.setState({
          snackMessage: "Remove failed: " + error.message,
          snackOpen: true
        })
      }).bind(self));

    self.setState({
      deleteDialogOpen: false,
      deleteKey: ''
    })
  }
};

export default Helper;