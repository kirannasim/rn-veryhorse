import {applyMiddleware,createStore,compose} from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';

import mergedReducers from './services';

const logger = createLogger({
	timestamps: true,
	duration: true
});

const store = createStore(
	mergedReducers,
	compose(applyMiddleware(thunk, logger))
);

export default store;