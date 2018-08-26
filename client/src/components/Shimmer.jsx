import React from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

const styles = {
    'shimmer-line-large': {
        width: '80%',
        height: 16,
        marginBottom: 8
    },
    'shimmer-line-small': {
        width: '40%',
        height: 12,
        marginBottom: 4
    }
}

const Shimmer = ({size, classes}) => {
    return <div className={classNames('shine', classes[`shimmer-line-${size}`])} />
};

export default withStyles(styles)(Shimmer);
