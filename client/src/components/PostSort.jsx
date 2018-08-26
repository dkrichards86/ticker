import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const styles = theme => ({
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});

class PostSort extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            sort: props.defaultSort,
        };
    }

    handleChange(event) {
        const value = event.target.value;

        let callback = () => this.props.setFilter('sort', value);

        if (value === null) {
            callback = () => this.props.unsetFilter('sort');
        }

        this.setState({sort: value}, callback);
    }

    render() {
        const { classes, sortOptions } = this.props;

        return (
            <FormControl className={classes.formControl}>
                <Select
                    value={this.state.sort}
                    onChange={(event) => this.handleChange(event)}
                    displayEmpty
                    name="sort"
                    className={classes.selectEmpty}>
                    {sortOptions.map( (opt, i) => (
                        <MenuItem
                            key={`sort_option_${i}`}
                            value={opt.key}>
                            {opt.value}
                        </MenuItem>
                    ))}
            </Select>
            </FormControl>
        );
    }
}

export default withStyles(styles)(PostSort);
