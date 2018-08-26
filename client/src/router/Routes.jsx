import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Route } from 'react-router-dom';
import { AuthRoute, UnauthRoute } from 'react-router-auth';

import AuthContainer from '../containers/AuthContainer';
import AuthResetContainer from '../containers/AuthForgotPasswordContainer';
import AuthResetConfirmContainer from '../containers/AuthResetConfirmContainer';
import PostsContainer from '../containers/PostsContainer';
import SettingsCategoryContainer from '../containers/SettingsCategoryContainer';
import SettingsFeedContainer from '../containers/SettingsFeedContainer';
import AccountContainer from '../containers/AccountContainer';

const Routes = ({isAuthenticated}) => (
    <div>
        <Route exact path="/" component={PostsContainer} />
        <UnauthRoute path="/login" component={AuthContainer} redirectTo="/" authenticated={isAuthenticated} />
        <UnauthRoute path="/forgot" component={AuthResetContainer} redirectTo="/" authenticated={isAuthenticated} />
        <UnauthRoute path="/reset/:uid/:token" component={AuthResetConfirmContainer} redirectTo="/" authenticated={isAuthenticated} />
        <AuthRoute exact path="/feeds" component={SettingsCategoryContainer} redirectTo="/login" authenticated={isAuthenticated} />
        <AuthRoute path="/feeds/:catid" component={SettingsFeedContainer} redirectTo="/login" authenticated={isAuthenticated} />
        <AuthRoute path="/account" component={AccountContainer} redirectTo="/login" authenticated={isAuthenticated} />
    </div>
);

const mapStateToProps = (state) => {
    const isAuthenticated = !!state.auth;

    return { isAuthenticated };
};

export default withRouter(connect(mapStateToProps)(Routes));