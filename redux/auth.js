import * as ActionTypes from './ActionTypes';

// The auth reducer. The starting state sets authentication
// based on a token being in local storage. In a real app,
// we would also want a util to check if the token is expired.
export const auth = (state = {
    isLoading: false,
    isAuthenticated: false,
    token: null,
    user: null,
    errMess: null
}, action) => {
    switch (action.type) {
        /*case ActionTypes.GET_AUTH:
            return {
                ...state
            };*/
        case ActionTypes.LOGIN_REQUEST:
            return {
                ...state,
                isLoading: true,
                isAuthenticated: false,
                user: action.creds
            };
        case ActionTypes.LOGIN_SUCCESS:
            return {
                ...state,
                isLoading: false,
                isAuthenticated: true,
                errMess: '',
                token: action.token,
                user: action.payload
            };
        case ActionTypes.LOGIN_FAILURE:
            return {
                ...state,
                isLoading: false,
                isAuthenticated: false,
                errMess: action.message
            };
        case ActionTypes.LOGOUT_REQUEST:
            return {
                ...state,
                isLoading: true,
                isAuthenticated: true
            };
        case ActionTypes.LOGOUT_SUCCESS:
            return {
                ...state,
                isLoading: false,
                isAuthenticated: false,
                token: '',
                user: null
            };
        case ActionTypes.ADD_USER:
            return {
                ...state,
                user: action.payload
            }
        case ActionTypes.SIGNUP_LOADING:
            return {
                ...state,
                isLoading: true,
                isAuthenticated: false,
                user: null
            };
        case ActionTypes.SIGNUP_SUCCESS:
            return {
                ...state,
                isLoading: false,
                isAuthenticated: false,
                errMess: ''
            };
        default:
            return state
    }
}