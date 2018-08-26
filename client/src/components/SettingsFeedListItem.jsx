import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import SettingsFeedForm from "./SettingsFeedForm";

const styles = theme => ({
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

class SettingsFeedListItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modal: false
        };
    }

    render() {
        const { classes, feed, deleteFeed, editFeed, categories } = this.props;

        return (
            <div>
                <ListItem dense divider={true}>
                    <ListItemText
                        primary={feed.title}
                        secondary={<a href={feed.url} target="_blank">{feed.url}</a>} />
                    <ListItemSecondaryAction>
                        <IconButton
                            onClick={() => this.setState({modal: true})}
                            aria-label="edit">
                            <EditIcon />
                        </IconButton>
                        <IconButton
                            onClick={() => deleteFeed(feed.id)}
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
                            Update Feed
                        </Typography>
                        <SettingsFeedForm
                            feed={feed}
                            onSubmit={editFeed}
                            categories={categories} 
                            onClose={() => this.setState({modal: false})} />
                    </div>
                </Modal>
            </div>
        );
    }
}

export default withStyles(styles)(SettingsFeedListItem);