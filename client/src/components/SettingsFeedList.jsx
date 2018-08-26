import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import SettingsFeedListItem from './SettingsFeedListItem';

import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';

import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import SettingsFeedForm from "./SettingsFeedForm";

const styles = theme => ({
    content: {
        maxWidth: 800,
        margin: '0 auto'
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

class SettingsFeedList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modal: false
        };
    }

    render() {
        const { classes, catid, categories, feeds, deleteFeed, addFeed, editFeed  } = this.props;

        return (
            <div className={classes.content}>
                <Paper>
                    <List>
                        {feeds.map(feed => (
                            <SettingsFeedListItem 
                                key={feed.id}
                                feed={feed}
                                catid={catid}
                                deleteFeed={deleteFeed}
                                editFeed={editFeed}
                                categories={categories} />
                        ))}
                    </List>
                    <Button
                        onClick={() => this.setState({modal: true})}
                        color="primary"
                        to="/feeds/add">
                        <AddIcon />
                        Add a Feed
                    </Button>
                    <Modal
                        open={this.state.modal}
                        onClose={() => this.setState({modal: false})}>
                        <div className={classes.modal}>
                            <Typography variant="title" id="modal-title">
                                Add a Feed
                            </Typography>
                            <SettingsFeedForm
                                categories={categories}
                                onSubmit={addFeed}
                                catid={catid}
                                onClose={() => this.setState({modal: false})} />
                        </div>
                    </Modal>
                </Paper>
            </div>
        );
    }
}

export default withStyles(styles)(SettingsFeedList);
