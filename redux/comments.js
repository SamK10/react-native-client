import * as ActionTypes from './ActionTypes';

export const comments = (state = {
    errMess: null,
    comments: []
}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_COMMENTS:
            return { ...state, isLoading: false, errMess: null, comments: action.payload };

        case ActionTypes.COMMENTS_FAILED:
            return { ...state, isLoading: false, errMess: action.payload, comments: [] };

        case ActionTypes.ADD_COMMENT:
            var comments = state.comments;
            comments.unshift(action.payload);
            return { ...state, isLoading: false, comments: comments };

        case ActionTypes.REMOVE_COMMENT:
            return {
                ...state, isLoading: false, comments: state.comments.filter((comment) => {
                    return comment._id !== action.payload;
                })
            };

        default:
            return state;
    }
}