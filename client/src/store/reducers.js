import { handleActions } from 'redux-actions';
import update from 'immutability-helper';

import { 
    LOGIN, LOGOUT, STORE_POSTS, STORE_CATEGORIES,
    STORE_FEEDS, ADD_FILTER, REMOVE_FILTER, CLEAR_FILTERS, SET_LOADING, ADD_CATEGORY,
    REMOVE_CATEGORY, UPDATE_CATEGORY, ADD_FEED, REMOVE_FEED, UPDATE_FEED,
    STORE_USER, UPDATE_USER
} from './reducer_types';

import { loadSetting, saveSetting, removeSetting } from './storage'

const initialState = { 
    auth: loadSetting('auth'),
    user: {},
    filters: {
        category: null,
        source: null,
        page: 1,
        sort: 'hot',
        view: 'posts'
    },
    loading: true,
    posts: {},
    categories: [],
    feeds: [],
    postView: 'posts'
};

const reducers = handleActions({
    [LOGOUT]: (state, action) => {
        removeSetting('auth');
        return update(state, {
            auth: {
                $set: null,
            }
        })
    },
    [LOGIN]: (state, action) => {
        saveSetting('auth', action.payload);
        return update(state, {
            auth: {
                $set: action.payload,
            }
        })
    },
    [STORE_USER]: (state, action) => {
        return update(state, {
            user: {
                $set: action.payload
            }
        })
    },
    [UPDATE_USER]: (state, action) => {
        removeSetting('user');
        return update(state, {
            user: {
                $set: action.payload
            }
        })
    },
    [STORE_POSTS]: (state, action) => {
        return update(state, {
            posts: {
                $set: action.payload
            }
        })
    },
    [STORE_CATEGORIES]: (state, action) => {
        return update(state, {
            categories: {
                $set: action.payload
            }
        })
    },
    [ADD_CATEGORY]: (state, action) => {
        return update(state, {
            categories: {
                $push: [action.payload]
            }
        })
    },
    [REMOVE_CATEGORY]: (state, action) => {
        const categories = state.categories.filter( c => c.id !== action.payload);

        return update(state, {
            categories: {
                $set: categories
            }
        })
    },
    [UPDATE_CATEGORY]: (state, action) => {
        const categories = state.categories.map( c => {
            if (c.id === action.payload.id) {
                c.title = action.payload.title;
            }

            return c;
        });

        return update(state, {
            categories: {
                $set: categories
            }
        })
    },
    [STORE_FEEDS]: (state, action) => {
        return update(state, {
            feeds: {
                $set: action.payload
            }
        })
    },
    [ADD_FEED]: (state, action) => {
        return update(state, {
            feeds: {
                $push: [action.payload]
            }
        })
    },
    [REMOVE_FEED]: (state, action) => {
        const feeds = state.feeds.filter( f => f.id !== action.payload);

        return update(state, {
            feeds: {
                $set: feeds
            }
        })
    },
    [UPDATE_FEED]: (state, action) => {
        const feeds = state.feeds.map( f => {
            if (f.id === action.payload.id) {
                f.title = action.payload.title;
                f.url = action.payload.url;
                f.category = action.payload.category;
            }

            return f;
        });

        return update(state, {
            feeds: {
                $set: feeds
            }
        })
    },
    [ADD_FILTER]: (state, action) => {
        return update(state, {
            filters: {
                [action.payload.key]: {
                    $set: action.payload.value
                }
            }
        })
    },
    [REMOVE_FILTER]: (state, action) => {
        return update(state, {
            filters: {
                [action.payload]: {
                    $set: null
                }
            }
        })
    },
    [CLEAR_FILTERS]: (state) => {
        return update(state, {
            filters: {
                $set: {}
            }
        })
    },
    [SET_LOADING]: (state, action) => {
        return update(state, {
            loading: {
                $set: action.payload
            }
        })
    },
}, initialState);

export default reducers;
