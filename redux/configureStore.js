import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { saves } from './saves';
import { posts } from './posts';
import { comments } from './comments';
import { events } from './events';
import { pages } from './pages';
import { auth } from './auth';

export const ConfigureStore = () => {

    const config = {
        key: 'root',
        storage,
        debug: true
    };

    const store = createStore(
        persistCombineReducers(config, {
            saves,
            posts,
            comments,
            events,
            pages,
            auth
        }),
        applyMiddleware(thunk, logger)
    );

    const persistor = persistStore(store);


    return { persistor, store };
}