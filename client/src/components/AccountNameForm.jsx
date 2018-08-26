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

class AccountNameForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            first_name: '',
            last_name: '',
        };
    }

    componentWillMount() {
        const first_name = get(this.props, 'user.first_name', '');
        const last_name = get(this.props, 'user.last_name', '');

        this.setState({ first_name, last_name });
    }

    componentWillReceiveProps(newProps) {
        if (!isEqual(this.props, newProps)) {
            const first_name = get(newProps, 'user.first_name', '');
            const last_name = get(newProps, 'user.last_name', '');

            this.setState({ first_name, last_name });
        }
    }

    clear() {
        const first_name = get(this.props, 'user.first_name', '');
        const last_name = get(this.props, 'user.last_name', '');

        this.setState({ first_name, last_name }, () => this.props.onClose());
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
                            id="first-name"
                            label="First Name"
                            type="text"
                            value={this.state.first_name}
                            onChange={(event) => this.setState({ first_name: event.target.value })} />
                    </FormGroup>
                    <FormGroup>
                        <TextField
                            id="last-name"
                            label="Last Name"
                            type="text"
                            value={this.state.last_name}
                            onChange={(event) => this.setState({ last_name: event.target.value })} />
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

export default withStyles(styles)(AccountNameForm);