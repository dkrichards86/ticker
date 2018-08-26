// NA)/4xb-ba6dde8d139c8bb2b6c8
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';

const PASSWORD1 = 'new_password1';
const PASSWORD2 = 'new_password2';

const styles = theme => ({
    content: {
      width: 800,
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

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            [PASSWORD1]: '',
            [PASSWORD2]: '',
            modal: null,
        };
    }

    closeModal() {
        this.setState({modal: null});
    }

    openModal(message) {
        this.setState({modal: message})
    }

    handleChange(type) {
        return (event) => {
            this.setState({ [type]: event.target.value });
        }
    };

    clear() {
        this.setState({ 
            [PASSWORD1]: '',
            [PASSWORD2]: ''
        });
    }

    submit() {
        const auth = {
            uid: this.props.match.params.uid,
            token: this.props.match.params.token,
            [PASSWORD1]: this.state[PASSWORD1],
            [PASSWORD2]: this.state[PASSWORD2],
        };

        this.props.confirmReset(auth, (msg) => this.openModal(msg.detail));
    }

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.content}>
                <Card>
                    <CardContent>
                        <FormLabel>Reset Your Password</FormLabel>
                        <FormControl fullWidth margin="dense">
                            <FormGroup>
                                <TextField
                                    id="password1-input"
                                    label="Password"
                                    type="password"
                                    value={this.state[PASSWORD1]}
                                    onChange={this.handleChange(PASSWORD1)} />
                            </FormGroup>
                        </FormControl>
                        <FormControl fullWidth margin="dense">
                            <FormGroup>
                                <TextField
                                    id="password2-input"
                                    label="Password Again"
                                    type="password"
                                    value={this.state[PASSWORD2]}
                                    onChange={this.handleChange(PASSWORD2)} />
                            </FormGroup>
                        </FormControl>
                        <Button variant="raised" color="primary" onClick={() => this.submit()}>
                            Submit
                        </Button>
                        <Button color="primary" onClick={() => this.clear()}>
                            Clear
                        </Button>
                    </CardContent>
                </Card>
                <Modal
                    open={!!this.state.modal}
                    onClose={() => this.setState({modal: null})}>
                    <div className={classes.modal}>
                        <Typography variant="title" id="modal-title">
                            Edit Account
                        </Typography>
                        {this.state.modal}
                    </div>
                </Modal>
            </div>
        );
    }
}

export default withStyles(styles)(Login);