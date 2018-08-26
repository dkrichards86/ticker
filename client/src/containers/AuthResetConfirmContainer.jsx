import React from 'react';
import { connect } from 'react-redux';

import WrapperContainer from '../containers/WrapperContainer';
import AuthReset from "../components/AuthResetConfirm";

import { 
    confirmReset
} from '../store/actions';

const LoginContainer = (props) => (
    <WrapperContainer
        title="Login"
        showDrawer={false}
        main={<AuthReset {...props} />} />
);

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {
        confirmReset: (auth, cb) => dispatch(confirmReset(auth, cb)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);