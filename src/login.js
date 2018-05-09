import React from 'react';
import axios from './axios'; //use my axios copy (./)
import { Link } from 'react-router-dom';

//Login is a child of Welcome
export default class Login extends React.Component { //we only extend when declaring Components as classes
    constructor(props) {
        super(props);
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
        this.submit = this.submit.bind(this);
    }
    handleChange(e) {
        this[e.target.name] = e.target.value;
    }
    submit() {
        console.log("this.email, pass", this.email, this.pass);
        axios
        .post('/login', {
            email: this.email,
            pass: this.pass
        })
        .then (resp => {
            console.log("resp axios post login", resp);
            if(resp.data.success) {
                console.log("success");
                location.replace('/')
            } else {
                this.setState({
                    error: resp.data.error
                });
            }
        })
    }
    render() {
        return (
            <div id="login-container">
                <h2>Login!</h2>
                {this.state.error && <div className="errmsg">{this.state.error}</div>}
                <input name="email" placeholder="email" onChange={this.handleChange} />
                <input name="pass" placeholder="pass" onChange={this.handleChange} />
                <button className="submitbtn" onClick={this.submit}>Submit</button>
                <a href="/welcome">Not a member?</a>
            </div>
        );
    }
}
