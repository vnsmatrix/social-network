import React from 'react';
import axios from './axios';
import { connect } from 'react-redux';
import { receiveFRList, unfriend, acceptFR } from './actions';
import {Link} from 'react-router-dom'


function mapStateToProps(state) {
    var logged = state.userId;
    console.log(state);
    return {
        friends: state.friendsAndWannabes && state.friendsAndWannabes.filter(user => user.status == 2),
        wannabes: state.friendsAndWannabes && state.friendsAndWannabes.filter(user => (user.status == 1 && user.sender_id != logged))
    }
}

class Friends extends React.Component {
    constructor(props) {
        super(props);
        console.log("this.props.status ", this.props.status);
        this.state = {
            status: this.props.status
        };
    }

    componentDidMount() {
        this.props.dispatch(receiveFRList());
    }

    render () {
        if (!this.props.friends) {
            return null;
        }
        return (
            <div className="friends-list">
                <div className="wannabes">
                    <h3>Pending:</h3>
                    {this.props.wannabes == 0 && <p>You have no pending friend requests :)</p>}
                    {this.props.wannabes.map(wannabe => {
                        return (
                            <div key={wannabe.id} className="wannabe">
                                <Link to={`/user/${wannabe.id}`}>
                                    {wannabe.img && <img src={wannabe.img} />}
                                    {!wannabe.img && <img src="/kitty3.gif" />}
                                </Link>
                                <div className="friends-right">
                                    <div className="friends-name">
                                        {wannabe.first} {wannabe.last}
                                    </div>
                                    <button className="frbtn" onClick={ () =>
                                        this.props.dispatch(acceptFR(wannabe.id))}>Accept</button>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="friends">
                    <h3>Friends:</h3>
                    {this.props.friends == 0 && <p>You have no friends yet :(</p>}
                    {this.props.friends.map(friend => {
                        return (
                            <div key={friend.id} className="friend">
                                <Link to={`/user/${friend.id}`}>
                                    {friend.img && <img src={friend.img} />}
                                    {!friend.img && <img src="/kitty3.gif" />}
                                </Link>
                                <div className="friends-right">
                                    <div className="friends-name">
                                        {friend.first} {friend.last}
                                    </div>
                                    <button className="frbtn" onClick={ () =>
                                        this.props.dispatch(unfriend(friend.id))}>Unfriend</button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}

//MUST BE AFTER CLASS COMPONENT!
export default connect (mapStateToProps)(Friends);
