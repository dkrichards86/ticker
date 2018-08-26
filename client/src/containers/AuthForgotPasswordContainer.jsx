import React from 'react';
import { connect } from 'react-redux';

import WrapperContainer from '../containers/WrapperContainer';
import AuthForgotPassword from "../components/AuthForgotPassword";

import { 
    fetchAuth, forgotPassword
} from '../store/actions';

const LoginContainer = (props) => (
    <WrapperContainer
        title="Login"
        showDrawer={false}
        main={<AuthForgotPassword {...props} />} />
);

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {
        forgotPassword: (email, cb) => dispatch(forgotPassword(email, cb))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);