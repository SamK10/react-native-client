import * as ActionTypes from './ActionTypes';

export const saves = (state = {
    isLoading: true,
    errMess: null,
    saves: []
}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_SAVES:
            return { ...state, isLoading: false, errMess: null, saves: action.payload };

        case ActionTypes.SAVES_LOADING:
            return { ...state, isLoading: true, errMess: null };

        case ActionTypes.SAVES_FAILED:
            return { ...state, isLoading: false, errMess: action.payload, saves: null };

        default:
            return state;
    }
}