import React from 'react';
import axios from './axios';
import FriendButton from './friendbutton';

export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sameProfile: true
        };
        this.fetchUser = this.fetchUser.bind(this);
    }

    componentDidMount() {
        console.log("component OtherProfile did mount / this.props", this.props);
        axios.get(`/get-user/${this.props.match.params.id}`).then(resp => {
            console.log("resp.data.sameProfile", resp.data.sameProfile);
            if(resp.data.sameProfile) {
                return this.props.history.push('/')
            }
            this.setState({
                first: resp.data.first,
                last: resp.data.last,
                email: resp.data.email,
                img: resp.data.img,
                bio: resp.data.bio,
                sameProfile: resp.data.sameProfile
            })
        }).catch(e => {
            console.log("component did not mount", e);
        })
    }

    componentWillReceiveProps(nextProps) {
        console.log("component will receive props", nextProps);
        if (parseInt(nextProps.match.params.id) != this.state.id) {
            this.fetchUser(nextProps.match.params.id);
        }
    }

    fetchUser(id) {
        axios.get(`/get-user/${this.props.match.params.id}`).then(resp => {
            this.setState({
                first: resp.data.first,
                last: resp.data.last,
                email: resp.data.email,
                img: resp.data.img,
                bio: resp.data.bio,
                sameProfile: resp.data.sameProfile
            })
        }).catch(e => {
            console.log(e);
        })
    }

    render() {
        console.log("otherProfile render this.state.sameProfile", this.state.sameProfile);
        return (
            <div id="otherprofile">
                <div className="profilepic-in-profile">
                    {this.state.img && <img src={this.state.img} />}
                    {!this.state.img && <img src="/kitty3.gif" />}
                </div>
                <div className="profile-right">
                    <div className="username-in-profile">
                        <h2>{this.state.first} {this.state.last}</h2>
                    </div>
                    <div className="bio">
                        <div id="bio-text">{this.state.bio}</div>
                    </div>
                    <div className="friend-btn">
                        <FriendButton otherUserId={this.props.match.params.id}
                                        />
                    </div>
                </div>
            </div>
        )
    }
}
