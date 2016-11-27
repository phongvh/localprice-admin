import React from 'react';
import {Link} from 'react-router';
import Drawer from 'material-ui/Drawer';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import IconItems from 'material-ui/svg-icons/notification/event-note';
import IconRequests from 'material-ui/svg-icons/action/note-add';
import IconFeedbacks from 'material-ui/svg-icons/action/feedback';
import IconUsers from 'material-ui/svg-icons/social/group';
import IconLocation from 'material-ui/svg-icons/communication/location-on';
import IconCategory from 'material-ui/svg-icons/device/storage';
import {grey500, pink300} from 'material-ui/styles/colors';
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

let _grey500 = '#666';

class DrawerCom extends React.Component {

  render() {
    return (
      <Drawer open={true} containerStyle={styles.drawer}>
        <List defaultValue={1} >
          <Link to='/' style={styles.link}>
            <ListItem 
              className={this.props.currentPage === '/' ? 'active menuItem' : 'menuItem'}
              primaryText={<span className="menuText">Items</span>}
              leftIcon={<IconItems color={this.props.currentPage === '/' ? pink300 : _grey500} />}
            />
          </Link>
          <Link to='/requests' style={styles.link}>
            <ListItem 
              className={this.props.currentPage === '/requests' ? 'active menuItem' : 'menuItem'} 
              primaryText={<span className="menuText">Requests</span>}
              leftIcon={<IconRequests color={this.props.currentPage === '/requests' ? pink300 : _grey500} />}
            />
           </Link>
          <Link to='/feedbacks' style={styles.link}>
            <ListItem 
              className={this.props.currentPage === '/feedbacks' ? 'active menuItem' : 'menuItem'} 
              primaryText={<span className="menuText">Feedbacks</span>}
              leftIcon={<IconFeedbacks color={this.props.currentPage === '/feedbacks' ? pink300 : _grey500} />} 
            />
          </Link>
          <Link to='/users' style={styles.link}>
            <ListItem 
              className={this.props.currentPage === '/users' ? 'active menuItem' : 'menuItem'} 
              primaryText={<span className="menuText">Users</span>}
              leftIcon={<IconUsers color={this.props.currentPage === '/users' ? pink300 : _grey500} />} 
            />
          </Link>
          <Link to='/location' style={styles.link}>
            <ListItem 
              className={this.props.currentPage === '/location' ? 'active menuItem' : 'menuItem'} 
              primaryText={<span className="menuText">Location</span>}
              leftIcon={<IconLocation color={this.props.currentPage === '/location' ? pink300 : grey500} />} 
            />
          </Link>
          <Link to='/category' style={styles.link}>
            <ListItem 
              className={this.props.currentPage === '/category' ? 'active menuItem' : 'menuItem'} 
              primaryText={<span className="menuText">Category</span>}
              leftIcon={<IconCategory color={this.props.currentPage === '/category' ? pink300 : grey500} />} 
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