import React from 'react';
import axios from './axios';
import { connect } from 'react-redux';
import { onlineUsers, userLeft, userJoined } from './actions';
import { Link } from 'react-router-dom'

function mapStateToProps(state) {
    return {
        online: state.loggedInUsers
    }
}

class Online extends React.Component {
    constructor(props) {
        super(props);
        console.log("props Online", props);
        this.state = {

        };
    }

    //do not need to dispatch onlineUsers in componentDidMount (socket doing it for me)

    render () {
        console.log("online render this.props", this.props);
        if (!this.props.online) {
            return null;
        }
        return (
            <div className="online">
                {this.props.online == 0 && <p>You are alone in the world :/</p>}
                {this.props.online.map(user => {
                    console.log(user);
                    return (
                        <div key={user.id} className="online-users">
                            <Link to={`/user/${user.id}`}>
                                {user.img && <img src={user.img} />}
                                {!user.img && <img src="/kitty3.gif" />}
                            </Link>
                            <div className="">
                                <div className="">
                                    {user.first} {user.last}
                                </div>
                            </div>
                        </div>
                    )
                })}

            </div>
        )
    }
}

//MUST BE AFTER CLASS COMPONENT!
export default connect (mapStateToProps)(Online);
