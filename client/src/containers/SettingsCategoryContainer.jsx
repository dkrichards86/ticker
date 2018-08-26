import React from 'react';
import { connect } from 'react-redux';
import get from 'lodash/get';

import WrapperContainer from '../containers/WrapperContainer';
import SettingsCategoryList from "../components/SettingsCategoryList";

import { deleteCategory, postCategory, patchCategory } from '../store/actions';

const SettingsCategoryListContainer = (props) => (
    <WrapperContainer
        title="Settings - Categories"
        back='/'
        showDrawer={false}
        main={<SettingsCategoryList {...props} />} />
);

const mapStateToProps = (state) => {
    const categories = get(state, "categories", []);

    return {
        categories
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        deleteCategory: (catid) => dispatch(deleteCategory(catid)),
        editCategory: (cat, success, failure) => dispatch(patchCategory(cat, success, failure)),
        addCategory: (cat, success, failure) => dispatch(postCategory(cat, success, failure)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsCategoryListContainer);