import { createAction } from 'redux-actions';
import 'whatwg-fetch';

import { deleteConfig, getConfig, patchConfig, postConfig, withAuthToken, fetcher } from './fetch_configs';

import { 
    LOGIN, LOGOUT, STORE_POSTS, STORE_CATEGORIES, 
    STORE_FEEDS, ADD_FILTER, REMOVE_FILTER, SET_LOADING, ADD_CATEGORY,
    REMOVE_CATEGORY, UPDATE_CATEGORY, ADD_FEED, REMOVE_FEED, UPDATE_FEED,
    STORE_USER, UPDATE_USER
} from './reducer_types';

const BASE_URL = 'http://localhost:8000';

export const storePosts = createAction(STORE_POSTS);
export const addFilter = createAction(ADD_FILTER);
export const removeFilter = createAction(REMOVE_FILTER);
export const setLoading = createAction(SET_LOADING);
export const login = createAction(LOGIN);
export const logout = createAction(LOGOUT);

export const hydrateStore = () => {
    return (dispatch) => {
        dispatch(fetchAccount());
        dispatch(getCategories());
        dispatch(getFeeds());
        dispatch(fetchPosts());
    };
}

export const setFilter = (key, value) => {
    return (dispatch) => {
        dispatch(addFilter({key, value}));

        // Unless we explicitly change the page, reset to page 1.
        if (key !== 'page') {
            dispatch(removeFilter('page'));
        }

        // If we change similar posts, we implicitly change to similar post view.
        if (key === 'similar') {
            dispatch(addFilter({key: 'view', value: 'similar'}));
        }

        // If we change categories, we implicitly change to post view.
        if (key === 'category') {
            dispatch(addFilter({key: 'view', value: 'posts'}));
        }

        // Since we're changing filters, fetch new data.
        dispatch(fetchPosts());
    };
}

export const unsetFilter = (type) => {
    return (dispatch) => {
        dispatch(removeFilter(type));
        dispatch(removeFilter('page'));
        dispatch(fetchPosts());
    };
}

export const fetchPosts = (filters = {}) => {
    return  (dispatch, getState) => {
        dispatch(setLoading(true));
        const state = getState();
        const filters = state.filters;
        
        let apiURL = `${BASE_URL}/api/${filters.view}/`;
        let args = []

        if (filters.category) {
            args.push(`category=${filters.category}`);
        }

        if (filters.page) {
            args.push(`page=${filters.page}`);
        }

        if (filters.source) {
            args.push(`source=${filters.source}`);
        }

        if (filters.sort) {
            args.push(`sort=${filters.sort}`);
        }

        if (filters.similar) {
            args.push(`post=${filters.similar}`);
        }

        if (args.length) {
            apiURL += `?${args.join("&")}`;
        }

        return fetcher(apiURL, withAuthToken(getConfig(), state))
            .then(data => {
                dispatch(storePosts(data));
                dispatch(setLoading(false));
            })
            .catch(err => {
                console.log("Error: ", err);
                dispatch(setLoading(false));
            });
    };
};

/**
 * Authenticaton
 */

export const fetchAuth = (auth) => {
    const apiURL = `${BASE_URL}/api/auth/login/`;

    return (dispatch, getState) => {
        return fetcher(apiURL, postConfig(auth))
            .then(data => {
                dispatch(login(data.key));
                dispatch(hydrateStore());
            })
            .catch(err => {
                console.log("Error: ", err);
            });
    };
};

export const fetchLogout = (auth) => {
    const apiURL = `${BASE_URL}/api/auth/logout/`;

    return (dispatch, getState) => {
        return fetcher(apiURL, postConfig(auth))
            .then(data => {
                dispatch(logout());
                dispatch(hydrateStore());
            })
            .catch(err => {
                console.log("Error: ", err);
            });
    };
};

export const forgotPassword = (email, cb) => {
    const apiURL = `${BASE_URL}/api/auth/password/reset/`;

    return (dispatch, getState) => {
        return fetcher(apiURL, postConfig(email))
            .then(data => {
                cb(data);
            })
            .catch(err => {
                console.log("Error: ", err);
            });
    };
};

export const confirmReset = (auth, cb) => {
    const apiURL = `${BASE_URL}/api/auth/password/reset/confirm/`;

    return (dispatch, getState) => {
        return fetcher(apiURL, postConfig(auth))
            .then(data => {
                cb(data);
            })
            .catch(err => {
                console.log("Error: ", err);
            });
    };
};

/**
 * 
 */

export const postActivity = (post) => {
    const apiURL = `${BASE_URL}/api/posts/activity/`;

    return (dispatch, getState) => {
        const state = getState();
        return fetcher(apiURL, withAuthToken(postConfig(post), state))
            .catch(err => {
                console.log("Error: ", err);
            });
    };
};

export const postFavorite = (post) => {
    const apiURL = `${BASE_URL}/api/posts/favorite/`;

    return (dispatch, getState) => {
        const state = getState();
        return fetcher(apiURL, withAuthToken(postConfig(post), state))
            .catch(err => {
                console.log("Error: ", err);
            });
    };
};

export const postBookmark = (post) => {
    const apiURL = `${BASE_URL}/api/posts/favorite/`;

    return (dispatch, getState) => {
        const state = getState();
        return fetcher(apiURL, withAuthToken(postConfig(post), state))
            .catch(err => {
                console.log("Error: ", err);
            });
    };
};
    

/**
 * Categories
 */
export const storeCategories = createAction(STORE_CATEGORIES);
export const addCategory = createAction(ADD_CATEGORY);
export const removeCategory = createAction(REMOVE_CATEGORY);
export const updateCategory = createAction(UPDATE_CATEGORY);

export const getCategories = () => {
    const apiURL = `${BASE_URL}/api/categories/`;
    
    return  (dispatch, getState) => {
        const state = getState();
        return fetcher(apiURL, withAuthToken(getConfig(), state))
            .then(data => dispatch(storeCategories(data)))
            .catch(err => console.log("Error: ", err));
    };
};

export const postCategory = (cat, success) => {
    const apiURL = `${BASE_URL}/api/categories/`;

    return (dispatch, getState) => {
        const state = getState();
        return fetcher(apiURL, withAuthToken(postConfig(cat), state))
            .then(data => {
                dispatch(addCategory(data));
                success();
            })
            .catch(err => {
                console.log("Error: ", err);
            });
    };
};

export const patchCategory = (cat, success) => {
    const apiURL = `${BASE_URL}/api/categories/${cat.id}/`;
    const patchCat = {
        title: cat.title,
        ordinal: cat.ordinal
    };

    return  (dispatch, getState) => {
        const state = getState();
        return fetcher(apiURL, withAuthToken(patchConfig(patchCat), state))
            .then(data => {
                dispatch(updateCategory(cat));
                success();
            })
            .catch(err => console.log("Error: ", err));
    };
};

export const deleteCategory = (catid) => {
    const apiURL = `${BASE_URL}/api/categories/${catid}/`;
    return  (dispatch, getState) => {
        const state = getState();
        return fetcher(apiURL, withAuthToken(deleteConfig(), state))
            .then(response => {
                if (response.ok) {
                    dispatch(removeCategory(catid));
                }
                else {
                    throw Error(response.statusText);
                }
            })
            .catch(err => console.log("Error: ", err));
    };
};

/**
 * Feeds
 */

export const storeFeeds = createAction(STORE_FEEDS);
export const addFeed = createAction(ADD_FEED);
export const removeFeed = createAction(REMOVE_FEED);
export const updateFeed = createAction(UPDATE_FEED);

export const getFeeds = () => {
    const apiURL = `${BASE_URL}/api/feeds/`;
    
    return  (dispatch, getState) => {
        const state = getState();
        return fetcher(apiURL, withAuthToken(getConfig(), state))
            .then(data => dispatch(storeFeeds(data)))
            .catch(err => console.log("Error: ", err));
    };
};

export const postFeed = (feed, success) => {
    const apiURL = `${BASE_URL}/api/feeds/`;
    const postFeed = {
        title: feed.title,
        feed_url: feed.url,
        category_id: feed.category
    };

    return (dispatch, getState) => {
        const state = getState();
        return fetcher(apiURL, withAuthToken(postConfig(postFeed), state))
            .then(data => {
                dispatch(addFeed(data));
                success();
            })
            .catch(err => {
                console.log("Error: ", err);
            });
    };
};

export const patchFeed = (feed, success) => {
    const apiURL = `${BASE_URL}/api/feeds/${feed.id}/`;
    const patchFeed = {
        id: feed.id,
        title: feed.title,
        feed_url: feed.url,
        category_id: feed.category
    };

    return  (dispatch, getState) => {
        const state = getState();
        return fetcher(apiURL, withAuthToken(patchConfig(patchFeed), state))
            .then(data => {
                dispatch(updateFeed(feed));
                success();
            })
            .catch(err => console.log("Error: ", err));
    };
};

export const deleteFeed = (feedid) => {
    const apiURL = `${BASE_URL}/api/feeds/${feedid}/`;
    return  (dispatch, getState) => {
        const state = getState();
        return fetch(apiURL, withAuthToken(deleteConfig(), state))
            .then(response => {
                if (response.ok) {
                    dispatch(removeFeed(feedid));
                }
                else {
                    throw Error(response.statusText);
                }
            })
            .catch(err => console.log("Error: ", err));
    };
};

/**
 * Accounts
 */
export const storeUser = createAction(STORE_USER);
export const updateUser = createAction(UPDATE_USER);

export const fetchAccount = () => {
    const apiURL = `${BASE_URL}/api/auth/user/`;
    
    return  (dispatch, getState) => {
        const state = getState();
        return fetcher(apiURL, withAuthToken(getConfig(), state))
            .then(data => dispatch(storeUser(data)))
            .catch(err => console.log("Error: ", err));
    };
};

export const patchAccount = (user, success) => {
    const apiURL = `${BASE_URL}/api/auth/user/`;

    return  (dispatch, getState) => {
        console.log(user);
        const state = getState();
        return fetcher(apiURL, withAuthToken(patchConfig(user), state))
            .then(data => {
                dispatch(updateUser(data));
                success();
            })
            .catch(err => console.log("Error: ", err));
    };
};

export const postPasswordChange = (passwords, success) => {
    const apiURL = `${BASE_URL}/api/auth/password/change/`;

    return (dispatch, getState) => {
        const state = getState();
        return fetcher(apiURL, withAuthToken(postConfig(passwords), state))
            .then(data => {
                success();
            })
            .catch(err => {
                console.log("Error: ", err);
            });
    };
};
