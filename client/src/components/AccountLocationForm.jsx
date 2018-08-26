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

class AccountLocationForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            location: ''
        };
    }

    componentWillMount() {
        const location = get(this.props, 'user.location', '');

        this.setState({ location });
    }

    componentWillReceiveProps(newProps) {
        if (!isEqual(this.props, newProps)) {
            const location = get(newProps, 'user.location', '');

            this.setState({ location });
        }
    }

    clear() {
        const location = get(this.props, 'user.location', '');

        this.setState({ location }, () => this.props.onClose());
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
                            id="location"
                            label="Location"
                            type="text"
                            value={this.state.location}
                            onChange={(event) => this.setState({location: event.target.value})} />
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

export default withStyles(styles)(AccountLocationForm);