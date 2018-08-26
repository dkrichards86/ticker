import React from "react";
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import ArrowBack from '@material-ui/icons/ArrowBack';
import DrawerContainer from '../containers/DrawerContainer';

const styles = theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        minHeight: '100vh',
        height: '100%',
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
    },
    flex: {
        flex: 1,
    },
    appBar: {
        width: '100%',
        zIndex: theme.zIndex.drawer + 1
    },
    toolbar: theme.mixins.toolbar,
    main: {
        padding: theme.spacing.unit * 3,
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        minWidth: 0,
    },
    link: {
        textDecoration: 'none',
        color: '#FFFFFF',
    },
    input: {
        color: "white"
    },
});

const Layout = ({ back, classes, showDrawer, isAuthenticated, main, title, user }) => {
    const drawer = showDrawer ? <DrawerContainer /> : null; 

    let signInButton = (
        <Button color="inherit" component={Link} to='/login'>
            Sign In
        </Button>
    );

    if (isAuthenticated) {
        signInButton = (
            <Link to="/account" className={classes.link}>
                {user}
            </Link>
        );
    }

    return (
        <div className={classes.root}>
            <AppBar position="absolute" className={classes.appBar}>
                <Toolbar>
                    {back && (
                        <IconButton color="inherit" component={Link} to={back}>
                            <ArrowBack />
                        </IconButton>
                    )}
                    <Typography variant="title" color="inherit" noWrap className={classes.flex}>
                        {title}
                    </Typography>
                    {signInButton}
                </Toolbar>
            </AppBar>
            {drawer}
            <main className={classes.main}>
                <div className={classes.toolbar} />
                {main}
            </main>
        </div>
    );
}

export default withStyles(styles)(Layout);
