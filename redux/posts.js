import * as ActionTypes from './ActionTypes';

export const posts = (state = {
    isLoading: true,
    errMess: null,
    offset: 0,
    posts: []
}, action) => {
    switch (action.type) {
        case ActionTypes.CLEAR_POSTS:
            return { ...state, isLoading: false, errMess: null, posts: [], offset: 0 };

        case ActionTypes.ADD_POSTS:
            return { ...state, isLoading: false, errMess: null, posts: state.posts.concat(action.payload), offset: state.offset + action.payload.length };

        case ActionTypes.POSTS_LOADING:
            return { ...state, isLoading: true, errMess: null }

        case ActionTypes.POSTS_FAILED:
            return { ...state, isLoading: false, errMess: action.payload };

        case ActionTypes.ADD_POST:
            var posts = state.posts;
            posts.unshift(action.payload);
            return { ...state, isLoading: false, posts: posts }

        case ActionTypes.DELETE_POST:
            return {
                ...state, isLoading: false, posts: state.posts.filter((post) => {
                    return post._id !== action.payload;
                })
            };

        default:
            return state;
    }
};