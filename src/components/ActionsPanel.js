import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import IconDelete from 'material-ui/svg-icons/action/delete-forever';
import IconEdit from 'material-ui/svg-icons/image/edit';
import {red700, blue500} from 'material-ui/styles/colors';

const ActionsPanel = (props) => {

	const handleDelete = () => {
		props.handleDelete(props.itemKey);
	}

	const handleEdit = () => {
		props.handleEdit(props.itemKey);
	}
	
	return (
		<span>
			<IconButton onTouchTap={handleEdit}>
        <IconEdit color={blue500}/>
      </IconButton>
			<IconButton onTouchTap={handleDelete}>
        <IconDelete color={red700}/>
      </IconButton>
		</span>
	);
}

export default ActionsPanel;