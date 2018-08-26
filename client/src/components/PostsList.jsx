import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import range from 'lodash/range';
import PostsListItem from './PostsListItem';
import PostListLoadingItem from './PostListLoadingItem';
import PostsListItemEmpty from './PostsListItemEmpty';
import PostPagination from './PostPagination';

import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
    postOptions: {
        display: 'flex',
        justifyContent: 'flex-end'
    }
});

const PostList = (props) => {
    const {
        posts, numPages, filterCategories, pageNumber, postActivity, postFavorite,
        loading, classes, setFilter, isAuthenticated
    } = props;


    let content = range(12).map((_, i) => <PostListLoadingItem key={`post_placeholder_${i}`}/>);
    
    if (!loading && posts.length > 0) {
        content = posts.map(p => (
            <PostsListItem
                post={p}
                key={`post_${p.link_hash}`}
                filterCategories={filterCategories}
                postActivity={postActivity}
                postFavorite={postFavorite}
                setFilter={setFilter}
                isAuthenticated={isAuthenticated} />
        ));
    }
    else if (!loading) {
        content = <PostsListItemEmpty />;
    }

    let paginate = null;
    if (numPages > 1) {
        paginate = (
            <PostPagination
                numPages={numPages}
                pageNumber={pageNumber}
                handlePageChange={(val) => setFilter('page', val)} />
        );
    }

    return (
        <div>
            <Paper>
                <List> 
                    {content}
                </List>
            </Paper>
            <div className={classes.postOptions}>
                {paginate}
            </div>
        </div>
    );
}

export default withStyles(styles)(PostList);
