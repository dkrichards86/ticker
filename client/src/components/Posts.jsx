import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PostsList from "../components/PostsList";
import PostSort from './PostSort';

const styles = {
    content: {
        maxWidth: 1024,
        margin: '0 auto'
    },
    postOptions: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        minHeight: 64,
        height: 'auto'
    },
    viewTitle: {
        marginBottom: 8,
        height: '100%',
    }
};

const Posts = (props) => {
    let sortOptions = [
        {
            key: 'hot',
            value: 'Hottest'
        },
        {
            key: 'new',
            value: 'Latest'
        }
    ];
    let defaultSort = 'hot';

    if (props.postView === 'bookmarks') {
        sortOptions = [
            {
                key: 'id',
                value: 'Date Bookmarked'
            },
            {
                key: 'new',
                value: 'Latest'
            }
        ];
        defaultSort = 'id';
    }
    
    let sorter = (
        <PostSort
            setFilter={props.setFilter} 
            sortOptions={sortOptions}
            defaultSort={defaultSort} />
    );

    return (
        <div className={props.classes.content}>
            <div className={props.classes.postOptions}>
                <div className={props.classes.viewTitle}>
                    {props.categoryTitle}
                </div>
                {sorter}
            </div>
            <PostsList {...props} />
        </div>
    );
};


export default withStyles(styles)(Posts);
