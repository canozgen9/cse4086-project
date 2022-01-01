import {applyMiddleware, compose, createStore} from 'redux'
import rootReducer from './reducers';
import thunk from 'redux-thunk';
import SocketMiddleware from "./socket/SocketMiddleware";

const store = createStore(rootReducer, compose(applyMiddleware(thunk, SocketMiddleware())))

export default store;
