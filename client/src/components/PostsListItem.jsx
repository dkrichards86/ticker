import React, { Component } from 'react';
import get from 'lodash/get';
import moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import BookmarkBorder from '@material-ui/icons/BookmarkBorder';
import Bookmark from '@material-ui/icons/Bookmark';
import MoreIcon from '@material-ui/icons/MoreVert';

const styles = theme => ({
    link: {
        textDecoration: 'none',
        color: '#000',
    },
});

class PostListItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            menuElem: false,
            isBookmark: props.post.is_bookmark || false
        };
    }

    handleClick = event => {
        this.setState({ menuElem: event.currentTarget });
    };
    
    handleClose = () => {
        this.setState({ menuElem: null });
    };

    handleView() {
        // 1 is view, 2 is favorite
        this.props.postActivity({
            post: this.props.post.id
        });
    }

    handleFavorite() {
        this.setState({isBookmark: !this.state.isBookmark}, () => {
            this.props.postFavorite({
                post: this.props.post.id,
            });
        });
    }

    render() {
        const { post, classes, filterCategories, setFilter, isAuthenticated } = this.props;
        const { menuElem, isBookmark } = this.state;

        let source = null;
        if (filterCategories) {
            const sources = post.feed.filter(f => filterCategories === f.category );

            if (sources.length) {
                source = get(sources[0], 'title', null);
            }
        }
        else {
            source = get(post.feed[0], 'title', null);
        }

        const postTitle = (
            <a
                href={post.link}
                onClick={() => this.handleView()}
                target="_blank"
                className={classes.link}
                dangerouslySetInnerHTML={{__html: post.title}} />
        );

        return (
            <ListItem divider>
                <ListItemText
                    primary={postTitle}
                    secondary={`${source} | ${moment(post.published_datetime).fromNow()}`}/>
                <ListItemSecondaryAction>
                    {isAuthenticated && (
                        <IconButton
                            onClick={() => this.handleFavorite()}
                            aria-label="bookmark">
                            {isBookmark ? <Bookmark /> : <BookmarkBorder />}
                        </IconButton>
                    )}
                    <IconButton
                        aria-owns={menuElem ? 'simple-menu' : null}
                        aria-haspopup="true"
                        onClick={this.handleClick}>
                        <MoreIcon />
                    </IconButton>
                </ListItemSecondaryAction>
                <Menu
                    id="simple-menu"
                    anchorEl={menuElem}
                    open={Boolean(menuElem)}
                    onClose={this.handleClose}>
                    <MenuItem onClick={() => setFilter('similar', post.id)}>
                        View Similar Posts
                    </MenuItem>
                </Menu>
            </ListItem>
        )
    }
}

export default withStyles(styles)(PostListItem);