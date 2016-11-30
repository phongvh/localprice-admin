import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import IconDelete from 'material-ui/svg-icons/action/delete-forever';
import IconEdit from 'material-ui/svg-icons/image/edit';
import IconView from 'material-ui/svg-icons/image/remove-red-eye';
import {red700, blue500, grey600} from 'material-ui/styles/colors';

const style = {
	height: 40,
	width: 40,
	padding: 8
}

class ActionPanelItem extends Component {

	handleDelete = () => {
		this.props.handleDelete(this.props.itemKey);
	}

	handleEdit = () => {
		this.props.handleEdit(this.props.itemKey);
	}

	handleView = () => {
		this.props.handleView(this.props.itemKey);
	}

	render() {
		return (
			<span>
				<IconButton onTouchTap={this.handleView} style={style} 
				tooltip='View' tooltipPosition='top-center'>
          <IconView color={grey600}/>
        </IconButton>
				<IconButton onTouchTap={this.handleEdit} style={style} 
				tooltip='Edit' tooltipPosition='top-center'>
          <IconEdit color={blue500}/>
        </IconButton>
				<IconButton onTouchTap={this.handleDelete} style={style} 
				tooltip='Delete' tooltipPosition='top-center'>
          <IconDelete color={red700}/>
        </IconButton>
			</span>
		);
	}
}

export default ActionPanelItem;