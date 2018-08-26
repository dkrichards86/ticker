import React from 'react';
import { connect } from 'react-redux';
import get from 'lodash/get';
import Posts from "../components/Posts";
import WrapperContainer from "../containers/WrapperContainer";

import { 
    fetchPosts, setFilter, unsetFilter, postCategory,
    postActivity, postFavorite
} from '../store/actions';

const PostsContainer = (props) => (
    <WrapperContainer
        title="Posts"
        showDrawer={true}
        main={<Posts {...props} />} />
);

const mapStateToProps = (state) => {
    const categories = get(state, "categories", []);
    const trends = get(state, "trends", []);
    const posts = get(state, 'posts.results', []);
    const numPages = get(state, 'posts.num_pages', 1);
    const postCount = get(state, 'posts.count', 0);
    const loading = state.loading;
    const pageNumber = get(state, "filters.page", null);
    const filterCategory = get(state, "filters.category", null);
    const postView = get(state, "filters.view", 'posts');
    const isAuthenticated = !!state.auth;

    let categoryTitle = 'All Posts';
    if (postView === 'posts' && filterCategory && categories) {
        let filteredCats = categories.filter(c => c.id === filterCategory);
        if (filteredCats[0] && filteredCats[0].title) {
            categoryTitle = filteredCats[0].title;
        }
    }

    if (postView === 'similar') {
        categoryTitle = 'Similar Posts';
    }

    return {
        categories, trends, posts, numPages, postCount, loading,
        isAuthenticated, pageNumber, postView, categoryTitle
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchPosts: () => dispatch(fetchPosts()),
        setFilter: (key, value) => dispatch(setFilter(key, value)),
        unsetFilter: (key) => dispatch(unsetFilter(key)),
        addCategory: (cat, success, failure) => dispatch(postCategory(cat, success, failure)),
        postActivity: (post) => dispatch(postActivity(post)),
        postFavorite: (post) => dispatch(postFavorite(post))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostsContainer);