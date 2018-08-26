import React, { Component } from 'react';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

const styles = {
    title: {
        marginBottom: 16,
        fontSize: 14,
    },
    actions: {
        textAlign: 'right'
    }    
};

class SettingsFeedEdit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: '',
            url: '',
            category: 0
        };
    }

    componentWillMount() {
        const title = get(this.props, 'feed.title', '');
        const url = get(this.props, 'feed.url', '');
        const category = get(this.props, 'catid', 0);

        this.setState({ 
            title: title,
            url: url,
            category: category
        });
    }

    componentWillReceiveProps(newProps) {
        if (!isEqual(this.props, newProps)) {
            const title = get(newProps, 'feed.title', '');
            const url = get(newProps, 'feed.url', '');
            const category = get(newProps, 'catid', 0);

            const stateObj = {};

            if (title !== '') {
                stateObj.title = title;
            }

            if (url !== '') {
                stateObj.url = url;
            }

            if (category !== 0) {
                stateObj.category = category;
            }

            this.setState(stateObj);
        }
    }

    clear() {
        const title = get(this.props, 'feed.title', '');
        const url = get(this.props, 'feed.url', '');
        const category = get(this.props, 'catid', 0);

        this.setState({ title, url, category }, () => this.props.onClose());
    }

    submit() {
        const feed = { 
            url: this.state.url,
            title: this.state.title,
            category: this.state.category
        };

        const id = get(this.props, 'feed.id', null);
        if (id) {
            feed.id = id;
        }

        const successCallback = () => this.props.history.push(`/feeds/${this.state.category}`);
        this.props.onSubmit(feed, () => successCallback());
    }

    render() {
        const { categories, classes } = this.props;
        return (
            <div>
                <FormControl fullWidth>
                    <FormGroup>
                        <TextField
                            id="feed-title"
                            label="Title"
                            type="text"
                            value={this.state.title}
                            onChange={(event) => this.setState({ title: event.target.value })} />
                    </FormGroup>
                    <FormGroup>
                        <TextField
                            id="feed-url"
                            label="Feed URL"
                            type="url"
                            value={this.state.url}
                            onChange={(event) => this.setState({ url: event.target.value })} />
                    </FormGroup>
                    <FormGroup>
                        <Select
                            value={this.state.category}
                            onChange={(event) => this.setState({ category: event.target.value })}
                            inputProps={{
                                name: 'category',
                                id: 'feed-category',
                            }}>
                            {categories.map(c => <MenuItem key={c.id} value={c.id}>{c.title}</MenuItem>)}
                        </Select>
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

export default withRouter(withStyles(styles)(SettingsFeedEdit));