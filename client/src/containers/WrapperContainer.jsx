import React from 'react';
import { connect } from 'react-redux';
import Wrapper from "../components/Wrapper";

const WrapperContainer = (props) =>  <Wrapper {...props} />;

const mapStateToProps = (state) => {
    const isAuthenticated = !!state.auth;
    const user = state.user.username;

    return {
        isAuthenticated, user
    };
};

export default connect(mapStateToProps)(WrapperContainer);