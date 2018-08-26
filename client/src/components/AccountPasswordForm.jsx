import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const styles = {
    title: {
        marginBottom: 16,
        fontSize: 14,
    },
    actions: {
        textAlign: 'right'
    }    
};

class AccountPasswordForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            curr_password: '',
            new_password1: '',
            new_password2: '',
        };
    }

    clear() {
        const curr_password = '';
        const new_password1 = '';
        const new_password2 = '';

        this.setState({ curr_password, new_password1, new_password2 }, () => this.props.onClose());
    }

    submit() {
        this.props.onSubmit({ ...this.state }, () => this.props.onClose());
    }

    render() {
        const { classes }= this.props;

        return (
            <div>
                <FormControl fullWidth>
                    <FormGroup>
                        <TextField
                            id="curr_password"
                            label="Current Password"
                            type="password"
                            value={this.state.curr_password}
                            onChange={(event) => this.setState({ curr_password: event.target.value })} />
                    </FormGroup>
                    <FormGroup>
                        <TextField
                            id="new_password1"
                            label="New Password"
                            type="password"
                            value={this.state.new_password1}
                            onChange={(event) => this.setState({ new_password1: event.target.value })} />
                    </FormGroup>
                    <FormGroup>
                        <TextField
                            id="new_password2"
                            label="Repeat Password"
                            type="password"
                            value={this.state.new_password2}
                            onChange={(event) => this.setState({ new_password2: event.target.value })} />
                    </FormGroup>
                </FormControl>
                <div className={classes.actions}>
                    <Button onClick={() => this.clear()}>
                        Cancel
                    </Button>
                    <Button color="primary" onClick={() => this.submit()}>
                        Done
                    </Button>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(AccountPasswordForm);