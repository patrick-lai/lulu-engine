import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import luluApi from './luluApi';

const rootReducer = combineReducers({
    luluApi,
    routing: routerReducer
});

export default rootReducer;
