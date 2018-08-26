import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import SettingsCategoryForm from "./SettingsCategoryForm";
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';

const styles = theme => ({
    cursor: {
        cursor: 'grab'
    },
    link: {
        textDecoration: 'none',
        color: '#000',
    },
    modal: {
        position: 'absolute',
        width: theme.spacing.unit * 50,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    },
});

const cardSource = {
    beginDrag(props) {
        return {
            id: props.id,
            index: props.index,
        }
    }
}

const cardTarget = {
    hover(props, monitor, component) {
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;

        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
            return
        }

        // Determine rectangle on screen
        const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

        // Get vertical middle
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

        // Determine mouse position
        const clientOffset = monitor.getClientOffset();

        // Get pixels to the top
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;

        // Only perform the move when the mouse has crossed half of the items height
        // When dragging downwards, only move when the cursor is below 50%
        // When dragging upwards, only move when the cursor is above 50%

        // Dragging downwards
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
            return
        }

        // Dragging upwards
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
            return
        }

        // Time to actually perform the action
        props.moveCategory(dragIndex, hoverIndex);

        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        monitor.getItem().index = hoverIndex;
    },
}

class SettingsCategoryListItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modal: false
        };
    }

    render() {
        const { 
            classes, category, deleteCategory, isDragging, connectDragSource,
            connectDropTarget, editCategory
        } = this.props;

        const opacity = isDragging ? 0 : 1

        const link = (
            <Link
                className={classes.link}
                to={`/feeds/${category.id}`}>
                {category.title}
            </Link>
        );

        return connectDragSource(connectDropTarget(
            <div style={{ opacity }} className={classes.cursor}>
                <ListItem divider={true}>
                    <ListItemText primary={link} />
                    <ListItemSecondaryAction>
                        <IconButton
                            onClick={() => this.setState({modal: true})}
                            aria-label="edit">
                            <EditIcon />
                        </IconButton>
                        <IconButton
                            onClick={() => deleteCategory(category.id)}
                            aria-label="Delete">
                            <DeleteIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
                <Modal
                    open={this.state.modal}
                    onClose={() => this.setState({modal: false})}>
                    <div className={classes.modal}>
                        <Typography variant="title" id="modal-title">
                            Rename a Category
                        </Typography>
                        <SettingsCategoryForm
                            category={category}
                            onSubmit={editCategory}
                            onClose={() => this.setState({modal: false})} />
                    </div>
                </Modal>
            </div>
        ));
    }
}

const collectDragSource = (connect, monitor) => {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
};

const collectDropTarget = (connect, monitor) => {
    return {
        connectDropTarget: connect.dropTarget(),
    };
};

export default (
    withStyles(styles)(
        DropTarget('category', cardTarget, collectDropTarget)(
            DragSource('category', cardSource, collectDragSource)(
                SettingsCategoryListItem
            )
        )
    )
);