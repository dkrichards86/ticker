import React, { Component } from 'react';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
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

class AccountUsernameForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
        };
    }

    componentWillMount() {
        const username = get(this.props, 'user.username', '');

        this.setState({ username });
    }

    componentWillReceiveProps(newProps) {
        if (!isEqual(this.props, newProps)) {
            const username = get(newProps, 'user.username', '');

            this.setState({ username });
        }
    }

    clear() {
        const username = get(this.props, 'user.username', '');

        this.setState({ username }, () => this.props.onClose());
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
                            id="username"
                            label="Username"
                            type="text"
                            value={this.state.username}
                            onChange={(event) => this.setState({ username: event.target.value })} />
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

export default withStyles(styles)(AccountUsernameForm);