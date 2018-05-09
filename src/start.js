import React from 'react';
import ReactDOM from 'react-dom';
import Welcome from './welcome';
import App from './app';
import initSocket from './socket'

//REDUX
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import reduxPromise from 'redux-promise';
import { reducer } from './reducers';
import { composeWithDevTools } from 'redux-devtools-extension';

const store = createStore(reducer, composeWithDevTools(applyMiddleware(reduxPromise)));

//if in welcome (not logged in), we render it. otherwise (logged in), we render App
if(location.pathname == '/welcome') {
    ReactDOM.render(<Welcome />, document.querySelector('main'));
} else {
    ReactDOM.render(<Provider store={store}><App /></Provider>, document.querySelector('main'))
    initSocket(store);
}
//provider provides the global state object and store contains it
