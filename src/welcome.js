import React from 'react';
import axios from './axios';
import { HashRouter, Route } from 'react-router-dom';
import { Register } from './register';
import Login from './login';

export default function Welcome (){
    return (
        <div className="container">
            <h1>Welcome...</h1>
            <img src="kitties.gif" alt="...for the power of kittens!" />
            <HashRouter>
                <div>
                    <Route exact path="/" component={Register} />
                    <Route path="/login" component={Login} />
                </div>
            </HashRouter>
        </div>
    );
}
