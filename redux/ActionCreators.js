import * as ActionTypes from './ActionTypes';
import { baseUrl } from '../shared/baseurl';
import { ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import * as Notifications from 'expo-notifications';

// Uploading Image

export const imageUpload = (url, name) => async (dispatch) => {

    let uriParts = url.split('.');
    let fileType = uriParts[uriParts.length - 1];
    let fileName = uriParts[uriParts.length - 2];

    const formData = new FormData();
    formData.append('imageFile', {
        uri: url,
        name: `${fileName}.${fileType}`,
        type: `image/${fileType}`,
    });

    const bearer = 'Bearer ' + await AsyncStorage.getItem('token');

    return fetch(baseUrl + 'imageUpload', {
        method: "POST",
        body: formData,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
            'Authorization': bearer
        },
        credentials: "same-origin"
    })
        .then(response => {
            if (response.ok) {
                return response;
            } else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        },
            error => {
                throw error;
            })
        .then(response => response.json())
        .catch(error => { alert('Your Image could not be uploaded\nError: ' + error.message); });
}

// Handling Posts

export const clearPosts = () => ({
    type: ActionTypes.CLEAR_POSTS
});

export const postsLoading = () => ({
    type: ActionTypes.POSTS_LOADING
});

export const postsFailed = (errmess) => ({
    type: ActionTypes.POSTS_FAILED,
    payload: errmess
});

export const addPosts = (posts) => ({
    type: ActionTypes.ADD_POSTS,
    payload: posts
});

export const fetchPosts = (offset) => async (dispatch) => {

    dispatch(postsLoading());

    return fetch(baseUrl + 'posts?limit=20&offset=' + offset)
        .then(response => {
            if (response.ok) {
                return response;
            } else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        },
            error => {
                var errmess = new Error(error.message);
                throw errmess;
            })
        .then(response => response.json())
        .then(posts => dispatch(addPosts(posts)))
        .catch(error => dispatch(postsFailed(error.message)));
};

export const addPost = (post) => ({
    type: ActionTypes.ADD_POST,
    payload: post
});

export const postPost = (title, details, avatar_url) => async (dispatch) => {

    dispatch(postsLoading());

    const bearer = 'Bearer ' + await AsyncStorage.getItem('token');

    const newPost = {
        title: title,
        details: details,
        avatar_url: avatar_url
    };

    return fetch(baseUrl + 'posts', {
        method: "POST",
        body: JSON.stringify(newPost),
        headers: {
            "Content-Type": "application/json",
            'Authorization': bearer
        },
        credentials: "same-origin"
    })
        .then(response => {
            if (response.ok) {
                alert('Post added');
                Notifications.setNotificationHandler({
                    handleNotification: async () => {
                        return {
                            shouldShowAlert: true,
                            shouldPlaySound: true,
                            shouldSetBadge: true,
                        };
                    },
                });
                const content = { title: 'I am a one, hasty notification.' };
                Notifications.scheduleNotificationAsync({ content, trigger: null });
                return response;
            } else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        },
            error => {
                throw error;
            })
        .then(response => response.json())
        .then(response => dispatch(addPost(response)))
        .catch(error => { dispatch(postsFailed(error.message)); alert('Your Post could not be posted\nError: ' + error.message); });
};

export const removePost = (postId) => ({
    type: ActionTypes.DELETE_POST,
    payload: postId
})

export const deletePost = (postId) => async (dispatch) => {

    const bearer = 'Bearer ' + await AsyncStorage.getItem('token');

    return fetch(baseUrl + 'posts/' + postId, {
        method: "DELETE",
        headers: {
            'Authorization': bearer
        },
        credentials: "same-origin"
    })
        .then(response => {
            if (response.ok) {
                alert('Deleted Post');
                return response;
            } else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        },
            error => {
                throw error;
            })
        .then(response => response.json())
        .then(post => dispatch(removePost(post._id)))
        .catch(error => { alert('Your Page could not be deleted\nError: ' + error.message); });
};

// Handling Comments

export const commentsFailed = (errmess) => ({
    type: ActionTypes.COMMENTS_FAILED,
    payload: errmess
});

export const addComments = (comments) => ({
    type: ActionTypes.ADD_COMMENTS,
    payload: comments
});

export const fetchComments = () => async (dispatch) => {
    return fetch(baseUrl + 'comments')
        .then(response => {
            if (response.ok) {
                return response;
            }
            else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        },
            error => {
                var errmess = new Error(error.message);
                throw errmess;
            })
        .then(response => response.json())
        .then(comments => dispatch(addComments(comments)))
        .catch(error => dispatch(commentsFailed(error.message)));
};

export const addComment = (comment) => ({
    type: ActionTypes.ADD_COMMENT,
    payload: comment
});

export const postComment = (postId, comment) => async (dispatch) => {

    const newComment = {
        post: postId,
        comment: comment
    }

    const bearer = 'Bearer ' + await AsyncStorage.getItem('token');

    return fetch(baseUrl + 'comments', {
        method: 'POST',
        body: JSON.stringify(newComment),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': bearer
        },
        credentials: 'same-origin'
    })
        .then(response => {
            if (response.ok) {
                alert('Comment added');
                return response;
            }
            else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        },
            error => {
                var errmess = new Error(error.message);
                throw errmess;
            })
        .then(response => response.json())
        .then(response => dispatch(addComment(response)))
        .catch(error => { dispatch(commentsFailed(error.message)); alert('Your Comment could not be posted\nError: ' + error.message); })
}

export const removeComment = (commentId) => ({
    type: ActionTypes.REMOVE_COMMENT,
    payload: commentId
})

export const deleteComment = (commentId) => async (dispatch) => {

    const bearer = 'Bearer ' + await AsyncStorage.getItem('token');

    return fetch(baseUrl + 'comments/' + commentId, {
        method: "DELETE",
        headers: {
            'Authorization': bearer
        },
        credentials: "same-origin"
    })
        .then(response => {
            if (response.ok) {
                alert('Deleted Comment');
                return response;
            } else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        },
            error => {
                throw error;
            })
        .then(response => response.json())
        .then(comment => dispatch(removeComment(comment._id)))
        .catch(error => { alert('Your Comment could not be deleted\nError: ' + error.message); });
};

// Handling Pages

export const pagesLoading = () => ({
    type: ActionTypes.PAGES_LOADING
});

export const pagesFailed = (errmess) => ({
    type: ActionTypes.PAGES_FAILED,
    payload: errmess
});

export const addPages = (pages) => ({
    type: ActionTypes.ADD_PAGES,
    payload: pages
});

export const fetchPages = () => async (dispatch) => {

    dispatch(pagesLoading());

    return fetch(baseUrl + 'pages')
        .then(response => {
            if (response.ok) {
                return response;
            } else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        },
            error => {
                var errmess = new Error(error.message);
                throw errmess;
            })
        .then(response => response.json())
        .then(pages => dispatch(addPages(pages)))
        .catch(error => dispatch(pagesFailed(error.message)));
};

export const addPage = (page) => ({
    type: ActionTypes.ADD_PAGE,
    payload: page
});

export const postPage = (cover_url, src, title) => async (dispatch) => {

    dispatch(pagesLoading());

    const coverPath = await dispatch(imageUpload(cover_url));
    const srcPath = await dispatch(imageUpload(src));

    const bearer = 'Bearer ' + await AsyncStorage.getItem('token');

    const newPage = {
        cover_url: coverPath.path.slice(7),
        src: srcPath.path.slice(7),
        title: title
    };

    return fetch(baseUrl + 'pages', {
        method: "POST",
        body: JSON.stringify(newPage),
        headers: {
            "Content-Type": "application/json",
            'Authorization': bearer
        },
        credentials: "same-origin"
    })
        .then(response => {
            if (response.ok) {
                alert('Page added');
                return response;
            } else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        },
            error => {
                throw error;
            })
        .then(response => response.json())
        .then(response => dispatch(addPage(response)))
        .catch(error => { dispatch(pagesFailed(error.message)); alert('Your Page could not be posted\nError: ' + error.message); });
};

export const removePage = (pageId) => ({
    type: ActionTypes.DELETE_PAGE,
    payload: pageId
})

export const deletePage = (pageId) => async (dispatch) => {

    const bearer = 'Bearer ' + await AsyncStorage.getItem('token');

    return fetch(baseUrl + 'pages/' + pageId, {
        method: "DELETE",
        headers: {
            'Authorization': bearer
        },
        credentials: "same-origin"
    })
        .then(response => {
            if (response.ok) {
                alert('Deleted Page');
                return response;
            } else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        },
            error => {
                throw error;
            })
        .then(response => response.json())
        .then(page => dispatch(removePage(page._id)))
        .catch(error => { alert('Your Page could not be deleted\nError: ' + error.message); });
};

// Handling Events

export const eventsLoading = () => ({
    type: ActionTypes.EVENTS_LOADING
});

export const eventsFailed = (errmess) => ({
    type: ActionTypes.EVENTS_FAILED,
    payload: errmess
});

export const addEvents = (events) => ({
    type: ActionTypes.ADD_EVENTS,
    payload: events
});

export const fetchEvents = () => async (dispatch) => {

    dispatch(eventsLoading());

    return fetch(baseUrl + 'events')
        .then(response => {
            if (response.ok) {
                return response;
            } else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        },
            error => {
                var errmess = new Error(error.message);
                throw errmess;
            })
        .then(response => response.json())
        .then(events => dispatch(addEvents(events)))
        .catch(error => dispatch(eventsFailed(error.message)));
};

export const addEvent = (event) => ({
    type: ActionTypes.ADD_EVENT,
    payload: event
});

export const postEvent = (src, title, date, location) => async (dispatch) => {

    dispatch(eventsLoading());

    const newEvent = {
        src: src,
        title: title,
        date: date,
        location: location
    };

    const bearer = 'Bearer ' + await AsyncStorage.getItem('token');

    return fetch(baseUrl + 'events', {
        method: "POST",
        body: JSON.stringify(newEvent),
        headers: {
            "Content-Type": "application/json",
            'Authorization': bearer
        },
        credentials: "same-origin"
    })
        .then(response => {
            if (response.ok) {
                alert('Event added');
                return response;
            } else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        },
            error => {
                throw error;
            })
        .then(response => response.json())
        .then(response => dispatch(addEvent(response)))
        .catch(error => { dispatch(eventsFailed(error.message)); alert('Your Event could not be posted\nError: ' + error.message); });
};

export const removeEvent = (eventId) => ({
    type: ActionTypes.DELETE_EVENT,
    payload: eventId
})

export const deleteEvent = (eventId) => async (dispatch) => {

    const bearer = 'Bearer ' + await AsyncStorage.getItem('token');

    return fetch(baseUrl + 'events/' + eventId, {
        method: "DELETE",
        headers: {
            'Authorization': bearer
        },
        credentials: "same-origin"
    })
        .then(response => {
            if (response.ok) {
                alert('Deleted Event');
                return response;
            } else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        },
            error => {
                throw error;
            })
        .then(response => response.json())
        .then(event => dispatch(removeEvent(event._id)))
        .catch(error => { alert('Your Event could not be deleted\nError: ' + error.message); });
};

// Handling Authentication

/*export const getAuth = () => {
    return async (dispatch) => {
        const [token, creds] = await Promise.all([
            AsyncStorage.getItem('token'),
            AsyncStorage.getItem('creds')
        ])
        dispatch({
            type: ActionTypes.GET_AUTH,
            payload: {
                isLoading: false,
                isAuthenticated: !!token,
                token: token,
                user: JSON.parse(creds),
                errMess: null
            }
        });
    }
}*/

export const requestLogin = (creds) => {
    return {
        type: ActionTypes.LOGIN_REQUEST,
        creds
    }
}

export const receiveLogin = (response) => {
    return {
        type: ActionTypes.LOGIN_SUCCESS,
        token: response.token,
        payload: response.user
    }
}

export const loginError = (message) => {
    return {
        type: ActionTypes.LOGIN_FAILURE,
        message
    }
}

export const loginUser = (creds) => async (dispatch) => {
    // We dispatch requestLogin to kickoff the call to the API
    dispatch(requestLogin(creds))

    return fetch(baseUrl + 'users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(creds)
    })
        .then(response => {
            if (response.ok) {
                return response;
            } else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        },
            error => {
                throw error;
            })
        .then(response => response.json())
        .then(async response => {
            // If login was successful, set the token in local storage
            if (response.success) {
                AsyncStorage.setItem('token', response.token);
                AsyncStorage.setItem('creds', JSON.stringify(creds));

                // Dispatch the success action
                await dispatch(fetchSaves());
                dispatch(receiveLogin(response));
            }
            else {
                var error = new Error('Error ' + response.status);
                error.response = response;
                throw error;
            }
        })
        .catch(error => dispatch(loginError(error.message)))
};

export const requestLogout = () => {
    return {
        type: ActionTypes.LOGOUT_REQUEST
    }
}

export const receiveLogout = () => {
    return {
        type: ActionTypes.LOGOUT_SUCCESS
    }
}

// Logs the user out
export const logoutUser = () => (dispatch) => {
    dispatch(requestLogout())
    AsyncStorage.removeItem('token');
    AsyncStorage.removeItem('creds');
    dispatch(savesFailed("Error 401: Unauthorized"));
    dispatch(receiveLogout())
}

export const signupLoading = () => {
    return {
        type: ActionTypes.SIGNUP_LOADING
    }
};

export const signupSuccess = () => {
    return {
        type: ActionTypes.SIGNUP_SUCCESS
    }
};

export const addUser = (display_pic, firstname, lastname, username, password) => ({
    type: ActionTypes.ADD_USER,
    payload: {
        display_pic: display_pic,
        firstname: firstname,
        lastname: lastname,
        username: username,
        password: password
    }
});

export const profileImageUpload = (url, name) => async (dispatch) => {

    let uriParts = url.split('.');
    let fileType = uriParts[uriParts.length - 1];
    let fileName = uriParts[uriParts.length - 2];

    const formData = new FormData();
    formData.append('imageFile', {
        uri: url,
        name: `${fileName}.${fileType}`,
        type: `image/${fileType}`,
    });

    return fetch(baseUrl + 'imageUpload/profilePic', {
        method: "POST",
        body: formData,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data'
        },
        credentials: "same-origin"
    })
        .then(response => {
            if (response.ok) {
                return response;
            } else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        },
            error => {
                throw error;
            })
        .then(response => response.json())
        .catch(error => { alert('Your Image could not be uploaded\nError: ' + error.message); });
}

export const registerUser = (path, firstname, lastname, username, password) => async (dispatch) => {

    dispatch(signupLoading());

    const response = await dispatch(profileImageUpload(path));

    const newUser = {
        display_pic: response.path.slice(7),
        firstname: firstname,
        lastname: lastname,
        username: username,
        password: password
    };

    return fetch(baseUrl + 'users/signup', {
        method: "POST",
        body: JSON.stringify(newUser),
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "same-origin"
    })
        .then(response => {
            if (response.ok) {
                alert('Registered Successfully');
                return response;
            } else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        },
            error => {
                throw error;
            })
        .then(response => response.json())
        .then(dispatch(signupSuccess()))
        .catch(error => { alert('Your User could not be registered\nError: ' + error.message); });
};

// Handling Saves

export const savesLoading = () => ({
    type: ActionTypes.SAVES_LOADING
});

export const savesFailed = (errmess) => ({
    type: ActionTypes.SAVES_FAILED,
    payload: errmess
});

export const addSaves = (saves) => ({
    type: ActionTypes.ADD_SAVES,
    payload: saves
});


export const fetchSaves = () => async (dispatch) => {
    dispatch(savesLoading());

    const bearer = 'Bearer ' + await AsyncStorage.getItem('token');

    return fetch(baseUrl + 'saves', {
        headers: {
            'Authorization': bearer
        },
    })
        .then(response => {
            if (response.ok) {
                return response;
            }
            else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        },
            error => {
                var errmess = new Error(error.message);
                throw errmess;
            })
        .then(response => response.json())
        .then(saves => dispatch(addSaves(saves)))
        .catch(error => dispatch(savesFailed(error.message)));
}

export const postSave = (postId) => async (dispatch) => {

    const bearer = 'Bearer ' + await AsyncStorage.getItem('token');

    return fetch(baseUrl + 'saves/' + postId, {
        method: "POST",
        body: JSON.stringify({ "_id": postId }),
        headers: {
            "Content-Type": "application/json",
            'Authorization': bearer
        },
        credentials: "same-origin"
    })
        .then(response => {
            if (response.ok) {
                ToastAndroid.show('Saved', ToastAndroid.SHORT);
                return response;
            } else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        },
            error => {
                throw error;
            })
        .then(response => response.json())
        .then(saves => { dispatch(addSaves(saves)); })
        .catch(error => dispatch(savesFailed(error.message)));
}

export const deleteSave = (postId) => async (dispatch) => {

    const bearer = 'Bearer ' + await AsyncStorage.getItem('token');

    return fetch(baseUrl + 'saves/' + postId, {
        method: "DELETE",
        headers: {
            'Authorization': bearer
        },
        credentials: "same-origin"
    })
        .then(response => {
            if (response.ok) {
                ToastAndroid.show('Removed', ToastAndroid.SHORT);
                return response;
            } else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        },
            error => {
                throw error;
            })
        .then(response => response.json())
        .then(saves => { dispatch(addSaves(saves)); })
        .catch(error => dispatch(savesFailed(error.message)));
};