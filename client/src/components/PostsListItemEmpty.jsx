import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const PostsListItemEmpty = () => (
    <ListItem>
        <ListItemText primary="There are no posts to show." />
    </ListItem>
);

export default PostsListItemEmpty;