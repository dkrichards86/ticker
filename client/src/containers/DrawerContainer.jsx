import React from 'react';
import { connect } from 'react-redux';
import get from 'lodash/get';

import WrapperDrawer from "../components/WrapperDrawer";

import { 
    setFilter, unsetFilter, fetchLogout
} from '../store/actions';

const DrawerContainer = (props) => <WrapperDrawer {...props} />;

const mapStateToProps = (state) => {
    const categories = get(state, "categories", []);
    const trends = get(state, "trends", []);
    const isAuthenticated = !!state.auth;

    return {
        categories, trends, isAuthenticated
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setFilter: (key, value) => dispatch(setFilter(key, value)),
        unsetFilter: (key) => dispatch(unsetFilter(key)),
        logout: () => dispatch(fetchLogout())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DrawerContainer);