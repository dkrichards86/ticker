import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import isEqual from 'lodash/isEqual';
import ReactPaginate from 'react-paginate';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';

const styles = theme => ({
    pagination: {
        listStyle: 'none',
        padding: 0
    },
    page: {
        display: 'inline-block',
        margin: 0,
        transition: '.15s ease-in',
        cursor: 'pointer'
    },
    pageLink: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: '24px',
        minWidth: 32,
        padding: theme.spacing.unit
    },
    active: {
        backgroundColor: theme.palette.primary.dark,
        color: '#fff'
    },
    disabled: {
        cursor: 'not-allowed'
    }
});

class PostPagination extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pageIndex: 0
        };
    }

    componentWillMount() {
        this.setPageState(this.props);
    }

    componentWillReceiveProps(newProps) {
        if (!isEqual(this.props.pageNumber, newProps.pageNumber)) {
            this.setPageState(newProps);
        }
    }

    handlePageChange(pageIndex) {
        const page = pageIndex + 1;

        this.props.handlePageChange(page);
    }

    setPageState(props) {
        if (props.pageNumber) {
            const pageIndex = props.pageNumber - 1;
            this.setState({ pageIndex });
        }
        else {
            const pageIndex = 0;
            this.setState({ pageIndex });
        }
    }

    render() {
        const { classes, numPages } = this.props;
        const { pageIndex } = this.state;

        const previous = (
            <IconButton size="small" color="primary">
                <ChevronLeft />
            </IconButton>
        );

        const next = (
            <IconButton size="small" color="primary">
                <ChevronRight />
            </IconButton>
        )

        return (
            <ReactPaginate
                previousLabel={previous}
                nextLabel={next}
                pageCount={numPages}
                forcePage={pageIndex}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={(val) => this.handlePageChange(val.selected)}
                containerClassName={classes.pagination}
                pageClassName={classes.page}
                pageLinkClassName={classes.pageLink}
                previousClassName={classes.page}
                previousLinkClassName={classes.pageLink}
                nextClassName={classes.page}
                nextLinkClassName={classes.pageLink}
                activeClassName={classes.active}
                breakClassName={classes.page}
                disabledClassName={classes.disabled}/>
        );
    }
}

export default withStyles(styles)(PostPagination);
