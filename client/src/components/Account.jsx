import React, { Component } from 'react';
import AccountEmailForm from './AccountEmailForm';
import AccountPasswordForm from './AccountPasswordForm';
import AccountUsernameForm from './AccountUsernameForm';
import AccountNameForm from './AccountNameForm';
import AccountLocationForm from './AccountLocationForm';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import Button from '@material-ui/core/Button';

import Modal from '@material-ui/core/Modal';

import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Divider from '@material-ui/core/Divider';

const styles = theme => ({
    paper: {
        marginBottom: 12
    },
    content: {
        maxWidth: 800,
        margin: '0 auto'
    },
    postOptions: {
        display: 'flex',
        justifyContent: 'flex-end',
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

class Account extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modal: null,
            emailList: false
        };
    }

    getModal() {
        if (!this.state.modal) {
            return;
        }

        const args = {
            user: this.props.user,
            onSubmit: this.props.editAccount,
            onClose: () => this.setState({modal: null})
        };

        const forms = {
            username: AccountUsernameForm,
            email: AccountEmailForm,
            name: AccountNameForm,
            location: AccountLocationForm,
            password: AccountPasswordForm,
        };

        const Component = forms[this.state.modal];
        return <Component {...args}/>;
    }

    render() {
        const { user, classes, logout } = this.props;

        return (
            <div className={classes.content}>
                <Paper className={classes.paper}>
                    <List>
                        <ListItem>
                            <ListItemText primary="Name" secondary={`${user.first_name} ${user.last_name}`}/>
                            <ListItemSecondaryAction>
                                <IconButton
                                    onClick={() => this.setState({modal: 'name'})}
                                    aria-label="edit">
                                    <EditIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <ListItemText primary="Location" secondary={`${user.location || ''}`} />
                            <ListItemSecondaryAction>
                                <IconButton
                                    onClick={() => this.setState({modal: 'location'})}
                                    aria-label="edit">
                                    <EditIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    </List>
                </Paper>
                <Paper className={classes.paper}>
                    <List>
                        <ListItem>
                            <ListItemText primary="Username" secondary={user.username} />
                            <ListItemSecondaryAction>
                                <IconButton
                                    onClick={() => this.setState({modal: 'username'})}
                                    aria-label="edit">
                                    <EditIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <ListItemText primary="Password" secondary="************"/>
                            <ListItemSecondaryAction>
                                <IconButton
                                    onClick={() => this.setState({modal: 'password'})}
                                    aria-label="edit">
                                    <EditIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    </List>
                </Paper>
                <Paper className={classes.paper}>
                    <List>
                        <ListItem>
                            <ListItemText primary="Email" secondary={user.email} />
                            <ListItemSecondaryAction>
                                <IconButton
                                    onClick={() => this.setState({modal: 'email'})}
                                    aria-label="edit">
                                    <EditIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    </List>
                </Paper>
                <div className={classes.postOptions}>
                    <Button size="small" onClick={() => logout()}>Sign Out</Button>
                </div>
                <Modal
                    open={!!this.state.modal}
                    onClose={() => this.setState({modal: null})}>
                    <div className={classes.modal}>
                        <Typography variant="title" id="modal-title">
                            Edit Account
                        </Typography>
                        {this.getModal()}
                    </div>
                </Modal>
            </div>
        );
    }
}

export default withStyles(styles)(Account);