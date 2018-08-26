import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Folder from '@material-ui/icons/Folder';
import Home from '@material-ui/icons/Home';
import AccountBox from '@material-ui/icons/AccountBox';
import SettingsApplications from '@material-ui/icons/SettingsApplications';
import Bookmark from '@material-ui/icons/Bookmark';

const drawerWidth = 280;

const styles = theme => ({
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        position: 'relative',
        width: drawerWidth,
        height: '100%'
    },
    nested: {
        paddingLeft: theme.spacing.unit * 6,
    }    
});

class WrapperDrawer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            categories: true,
        };
    }

    render() {
        const {
            classes, categories, setFilter, unsetFilter, isAuthenticated
        } = this.props;

        let managementSettings = (
            <div>
                <ListItem button component={Link} to='/login'>
                    <ListItemIcon>
                        <SettingsApplications />
                    </ListItemIcon>
                    <ListItemText primary="Manage Feeds" />
                </ListItem>
                <ListItem button component={Link} to='/login'>
                    <ListItemIcon>
                        <AccountBox />
                    </ListItemIcon>
                    <ListItemText primary="Account Settings" />
                </ListItem>
            </div>
        );

        if (isAuthenticated) {
            managementSettings = (
                <div>
                    <ListItem button component={Link} to='/feeds'>
                        <ListItemIcon>
                            <SettingsApplications />
                        </ListItemIcon>
                        <ListItemText primary="Manage Feeds" />
                    </ListItem>
                    <ListItem button component={Link} to='/account'>
                        <ListItemIcon>
                            <AccountBox />
                        </ListItemIcon>
                        <ListItemText primary="Account Settings" />
                    </ListItem>
                </div>
            );
        }

        return (
            <Drawer
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
                anchor='left'>
                <div className={classes.toolbar} />
                <List component="nav">
                    <ListItem button>
                        <ListItemIcon>
                            <Home />
                        </ListItemIcon>
                        <ListItemText
                            primary="Home"
                            onClick={() => unsetFilter('category')} />
                    </ListItem>
                    <ListItem button onClick={() => this.setState({categories: !this.state.categories})}>
                        <ListItemIcon>
                            <Folder />
                        </ListItemIcon>
                        <ListItemText primary="Categories" />
                        {this.state.categories ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={this.state.categories} timeout="auto" unmountOnExit>
                        <List component="div" dense>
                            {categories.map(c => (
                                <ListItem 
                                    button
                                    key={`category_${c.id}`}
                                    className={classes.nested}>
                                    <ListItemText
                                        primary={c.title}
                                        onClick={() => setFilter('category', c.id)} />
                                </ListItem>
                            ))}
                        </List>
                    </Collapse>
                    <ListItem button>
                        <ListItemIcon>
                            <Bookmark />
                        </ListItemIcon>
                        <ListItemText
                            primary="Saved Posts"
                            onClick={() => setFilter('view', 'bookmarks')} />
                    </ListItem>
                    {managementSettings}
                </List>
            </Drawer>
        );
    }
}
export default withStyles(styles)(WrapperDrawer);
