import React from 'react';
import axios from './axios';

export default class FriendButton extends React.Component {
    constructor(props) {
        super(props);
        console.log("this.props.status ", this.props.status);
        this.state = {
            status: this.props.status
        };
        this.sendFR = this.sendFR.bind(this);
        this.cancelFR = this.cancelFR.bind(this);
        this.acceptFR = this.acceptFR.bind(this);
        this.rejectFR = this.rejectFR.bind(this);
        this.deleteFR = this.deleteFR.bind(this);
    }

    componentDidMount() {
        axios
        .get('/seeFR/' + this.props.otherUserId)
        .then (resp => {
            console.log("resp axios get seeFR", resp);
            if(resp.data.success) {
                console.log("success!");
                this.setState({
                    status: resp.data.status,
                    sender_id: resp.data.sender_id,
                    receiver_id: resp.data.receiver_id
                });
                console.log('status ', resp.data.status);
            } else {
                this.setState({
                    error: resp.data.error
                });
            }
        })
    }

    sendFR() {
        console.log("this.props.otherUserId", this.props.otherUserId);
        axios
        .post('/sendFR', {
            otherUserId: this.props.otherUserId
        })
        .then (resp => {
            console.log("resp axios post sendFR", resp);
            if(resp.data.success) {
                console.log("success!");
                this.setState({
                    status: resp.data.status,
                    receiver_id: resp.data.receiver_id,
                    sender_id: resp.data.sender_id
                });
            } else {
                this.setState({
                    error: resp.data.error
                });
            }
        })
    }

    cancelFR() {
        axios
        .post('/cancelFR', {
            otherUserId: this.props.otherUserId
        })
        .then (resp => {
            console.log("resp axios post cancelFR", resp);
            if(resp.data.success) {
                console.log("success!");
                console.log("resp.data.id", resp.data.id);
                this.setState({
                    status: resp.data.status,
                    receiver_id: resp.data.receiver_id,
                    sender_id: resp.data.sender_id
                });
            } else {
                this.setState({
                    error: resp.data.error
                });
            }
        })
    }
    acceptFR() {
        axios
        .post('/acceptFR', {
            otherUserId: this.props.otherUserId
        })
        .then (resp => {
            console.log("resp axios post acceptFR", resp);
            if(resp.data.success) {
                console.log("success!");
                console.log("resp.data.id", resp.data.id);
                this.setState({
                    status: resp.data.status,
                    receiver_id: resp.data.receiver_id,
                    sender_id: resp.data.sender_id
                });
            } else {
                this.setState({
                    error: resp.data.error
                });
            }
        })
    }
    rejectFR() {
        axios
        .post('/rejectFR', {
            otherUserId: this.props.otherUserId
        })
        .then (resp => {
            console.log("resp axios post rejectFR", resp);
            if(resp.data.success) {
                console.log("success!");
                console.log("resp.data.id", resp.data.id);
                this.setState({
                    status: resp.data.status,
                    receiver_id: resp.data.receiver_id,
                    sender_id: resp.data.sender_id
                });
            } else {
                this.setState({
                    error: resp.data.error
                });
            }
        })
    }

    deleteFR() {
        axios
        .post('/deleteFR', {
            otherUserId: this.props.otherUserId
        })
        .then (resp => {
            console.log("resp axios post deleteFR", resp);
            if(resp.data.success) {
                console.log("success!");
                console.log("resp.data.id", resp.data.id);
                this.setState({
                    status: resp.data.status,
                    receiver_id: resp.data.receiver_id,
                    sender_id: resp.data.sender_id
                });
            } else {
                this.setState({
                    error: resp.data.error
                });
            }
        })
    }

    render () {
        console.log("this.state", this.state)
        return (
            <div>
                {(!this.state.status || this.state.status == 3 || this.state.status == 4 || this.state.status == 5) && <button className="frbtn" onClick={this.sendFR}>Send Friend Request</button>
                || ((this.state.status == 1 && this.state.sender_id == this.props.otherUserId) && <button className="frbtn" onClick={this.acceptFR}>Accept Friend Request</button>)
                || ((this.state.status == 1 && this.state.sender_id != this.props.otherUserId) && <button className="frbtn" onClick={this.cancelFR}>Cancel Friend Request</button>)
                || (this.state.status == 2 && <button className="frbtn" onClick={this.deleteFR}>Unfriend</button>)
                }
            </div>
        );
    }
}
