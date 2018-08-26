import React, { Component } from 'react';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const styles = {
    actions: {
        textAlign: 'right'
    }
};

class SettingsCategoryForm extends Component {
    constructor(props) {
        super(props);
        
        this.state = { title: '' };
    }

    componentWillMount() {
        const title = get(this.props, 'category.title', '');

        if (title) {
            this.setState({ title: title });
        }
    }

    componentWillReceiveProps(newProps) {
        if (!isEqual(this.props, newProps)) {
            const title = get(newProps, 'category.title', '');

            if (title) {
                this.setState({ title: title });
            }
        }
    }

    handleChange(event) {
        this.setState({ title: event.target.value });
    };

    clear() {
        const title = get(this.props, 'category.title', '');

        this.setState({ title }, () => this.props.onClose());
    }

    submit() {
        const cat = { 
            title: this.state.title
        };

        const id = get(this.props, 'category.id', null);
        const ordinal = get(this.props, 'category.ordinal', null);
        if (id) {
            cat.id = id;
        }

        if (ordinal) {
            cat.ordinal = ordinal;
        }

        const successCallback = () => this.props.history.push('/feeds/');
        this.props.onSubmit(cat, () => successCallback());
    }

    render() {
        return (
            <div>
                <FormControl fullWidth margin="dense">
                <FormGroup>
                        <TextField
                            id="category-input"
                            type="text"
                            value={this.state.title}
                            onChange={(event) => this.handleChange(event)} />
                    </FormGroup>
                </FormControl>
                <div className={this.props.classes.actions}>
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

export default withRouter(withStyles(styles)(SettingsCategoryForm));