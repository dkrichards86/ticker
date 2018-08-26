import React from 'react';
import { connect } from 'react-redux';
import get from 'lodash/get';

import WrapperContainer from '../containers/WrapperContainer';
import SettingsFeedList from "../components/SettingsFeedList";

import { deleteFeed, postFeed, patchFeed } from '../store/actions';

const SettingsCategoryListContainer = (props) => (
    <WrapperContainer
        title={`${props.catTitle} - Manage`}
        back='/feeds'
        showDrawer={false}
        main={<SettingsFeedList {...props} />} />
);

const mapStateToProps = (state, ownProps) => {
    const categories = get(state, "categories", []);
    const catid = parseInt(ownProps.match.params.catid, 10);
    const stateFeeds = get(state, "feeds", []);
    const feeds = stateFeeds.filter(f => parseInt(f.category.id, 10) === catid);
    const catTitle = get(categories.filter(c => c.id === catid)[0], "title", "Category");

    return {
        categories, catid, feeds, catTitle
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        deleteFeed: (catid) => dispatch(deleteFeed(catid)),
        addFeed: (feed, success, failure) => dispatch(postFeed(feed, success, failure)),
        editFeed: (feed, success, failure) => dispatch(patchFeed(feed, success, failure)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsCategoryListContainer);