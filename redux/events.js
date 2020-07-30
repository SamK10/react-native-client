import * as ActionTypes from './ActionTypes';

export const events = (state = {
    isLoading: true,
    errMess: null,
    events: []
}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_EVENTS:
            return { ...state, isLoading: false, errMess: null, events: action.payload };

        case ActionTypes.EVENTS_LOADING:
            return { ...state, isLoading: true, errMess: null }

        case ActionTypes.EVENTS_FAILED:
            return { ...state, isLoading: false, errMess: action.payload };

        case ActionTypes.ADD_EVENT:
            var events = state.events;
            events.unshift(action.payload);
            return { ...state, isLoading: false, events: events }

        case ActionTypes.DELETE_EVENT:
            return {
                ...state, isLoading: false, events: state.events.filter((event) => {
                    return event._id !== action.payload;
                })
            };

        default:
            return state;
    }
};