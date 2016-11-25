import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import IconDelete from 'material-ui/svg-icons/action/delete-forever';
import IconEdit from 'material-ui/svg-icons/image/edit';
import {red700, blue500} from 'material-ui/styles/colors';

class ActionsPanel extends Component {

	handleDelete = () => {
		this.props.handleDelete(this.props.itemKey);
	}

	handleEdit = () => {
		this.props.handleEdit(this.props.itemKey);
	}

	render() {
		return (
			<span>
				<IconButton onTouchTap={this.handleEdit}>
          <IconEdit color={blue500}/>
        </IconButton>
				<IconButton onTouchTap={this.handleDelete}>
          <IconDelete color={red700}/>
        </IconButton>
			</span>
		);
	}
}

export default ActionsPanel;