import React from 'react';
import axios from './axios'; //use my axios copy (./)
import { Link } from 'react-router-dom';

//Register is a child of Welcome
export class Register extends React.Component { //we only extend when declaring Components as classes
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
        console.log("this.props", this.first, this.last, this.email, this.pass);
        axios
        .post('/register', {
            first: this.first,
            last: this.last,
            email: this.email,
            pass: this.pass
        })
        .then (resp => {
            console.log("resp axios post register", resp);
            if(resp.data.success) {
                console.log("success!");
                location.replace('/')
            } else {
                this.setState({
                    error: resp.data.error
                });
            }
        }).catch(e => {
            console.log(e);
        })
    }
    
    render() {
        return (
            <div id="register-container">
                <h2>Join us!</h2>
                {this.state.error && <div className="errmsg">{this.state.error}</div>}
                <input name="first" placeholder="first name" onChange={this.handleChange} />
                <input name="last" placeholder="last name" onChange={this.handleChange} />
                <input name="email" placeholder="email" onChange={this.handleChange} />
                <input name="pass" placeholder="pass" onChange={this.handleChange} />
                <button className="submitbtn" onClick={this.submit}>Submit</button>
                <Link to="/login">
                    <div>Already a member?</div>
                </Link>
            </div>
        );
    }
}
