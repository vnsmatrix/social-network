import React from 'react';
import axios from './axios';
import { Link } from 'react-router-dom';

export default class UserSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
        this.submit = this.submit.bind(this);
    }
    handleChange(e) {
        this[e.target.name] = e.target.value;
        console.log("UserSearch: this.name", this.name);
        axios
        .get('/getUsersbyName', {
            first: this.name,
            last: this.name
        })
        .then (resp => {
            console.log("resp axios userSearch", resp);
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
            <div id="user-search">
                {this.state.error && <div className="errmsg">{this.state.error}</div>}
                <input name="name" placeholder="username" onChange={this.handleChange} />

            </div>
        );
    }
}
