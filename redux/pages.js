import * as ActionTypes from './ActionTypes';

export const pages = (state = {
    isLoading: true,
    errMess: null,
    pages: []
}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_PAGES:
            return { ...state, isLoading: false, errMess: null, pages: action.payload };

        case ActionTypes.PAGES_LOADING:
            return { ...state, isLoading: true, errMess: null }

        case ActionTypes.PAGES_FAILED:
            return { ...state, isLoading: false, errMess: action.payload };

        case ActionTypes.ADD_PAGE:
            var pages = state.pages;
            pages.unshift(action.payload);
            return { ...state, isLoading: false, pages: pages }

        case ActionTypes.DELETE_PAGE:
            return {
                ...state, isLoading: false, pages: state.pages.filter((page) => {
                    return page._id !== action.payload;
                })
            };

        default:
            return state;
    }
};