import React from 'react';
import { connect } from 'react-redux';

import WrapperContainer from '../containers/WrapperContainer';
import AuthLogin from "../components/AuthLogin";

import { 
    fetchAuth, forgotPassword
} from '../store/actions';

const LoginContainer = (props) => (
    <WrapperContainer
        title="Login"
        showDrawer={false}
        main={<AuthLogin {...props} />} />
);

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {
        login: (auth) => dispatch(fetchAuth(auth)),
        forgotPassword: (email) => dispatch(forgotPassword(email))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);