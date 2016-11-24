import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import Drawer from 'material-ui/Drawer';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import IconItems from 'material-ui/svg-icons/notification/event-note';
import IconRequests from 'material-ui/svg-icons/action/note-add';
import IconFeedbacks from 'material-ui/svg-icons/action/feedback';
import IconUsers from 'material-ui/svg-icons/social/group';
import IconData from 'material-ui/svg-icons/device/storage';
import {orange500, grey500} from 'material-ui/styles/colors';
import Divider from 'material-ui/Divider';

const styles = {
  drawer: {
    top: 70,
    paddingTop: 20
  },
  link: {
    textDecoration: 'none'
  }
};

class DrawerCom extends React.Component {

  render() {
    return (
      <Drawer open={true} containerStyle={styles.drawer}>
        <List defaultValue={1} >
          <Link to='/' style={styles.link}>
            <ListItem 
              className={this.props.currentPage == '/' ? 'active menuItem' : 'menuItem'}
              primaryText="Items"
              leftIcon={<IconItems color={this.props.currentPage == '/' ? orange500 : grey500} />}
            />
          </Link>
          <Link to='/requests' style={styles.link}>
            <ListItem 
              className={this.props.currentPage == '/requests' ? 'active menuItem' : 'menuItem'} 
              primaryText="Requests" 
              leftIcon={<IconRequests color={this.props.currentPage == '/requests' ? orange500 : grey500} />}
            />
           </Link>
          <Link to='/feedbacks' style={styles.link}>
            <ListItem 
              className={this.props.currentPage == '/feedbacks' ? 'active menuItem' : 'menuItem'} 
              primaryText="Feedbacks" 
              leftIcon={<IconFeedbacks color={this.props.currentPage == '/feedbacks' ? orange500 : grey500} />} 
            />
          </Link>
          <Link to='/users' style={styles.link}>
            <ListItem 
              className={this.props.currentPage == '/users' ? 'active menuItem' : 'menuItem'} 
              primaryText="Users" 
              leftIcon={<IconUsers color={this.props.currentPage == '/users' ? orange500 : grey500} />} 
            />
          </Link>
          <Link to='/data' style={styles.link}>
            <ListItem 
              className={this.props.currentPage == '/data' ? 'active menuItem' : 'menuItem'} 
              primaryText="Data" 
              leftIcon={<IconData color={this.props.currentPage == '/data' ? orange500 : grey500} />} 
            />
          </Link>
        </List>
        <Divider style={{marginTop: 20, marginBottom: 20}} />
        <Subheader>Statistics</Subheader>
        <ListItem primaryText="Total items: 20" />
      </Drawer>
    );
  }
}

DrawerCom.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default DrawerCom;