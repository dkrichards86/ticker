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

class AccountEmailForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: ''
        };
    }

    componentWillMount() {
        const email = get(this.props, 'user.email', '');

        this.setState({ email });
    }

    componentWillReceiveProps(newProps) {
        if (!isEqual(this.props, newProps)) {
            const email = get(newProps, 'user.email', '');

            this.setState({ email });
        }
    }

    clear() {
        const email = get(this.props, 'user.email', '');

        this.setState({ email }, () => this.props.onClose());
    }

    submit() {
        this.props.onSubmit({ ...this.state }, () => this.props.onClose());
    }

    render() {
        const { classes } = this.props;

        return (
            <div>
                <FormControl fullWidth>
                    <FormGroup>
                        <TextField
                            id="email"
                            label="Email"
                            type="email"
                            value={this.state.email}
                            onChange={(event) => this.setState({ email: event.target.value })} />
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

export default withStyles(styles)(AccountEmailForm);