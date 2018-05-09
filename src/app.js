import React from 'react';
import axios from './axios';
import Logo from './logo';
import ProfilePic from './profilepic';
import ProfilePicUpload from './profilepicupload';
import Profile from './profile';
import OtherProfile from './otherprofile';
import {BrowserRouter, Route, Link} from 'react-router-dom'
import {receiveFRList, acceptFR, unfriend } from './actions'
import Friends from './friends'
import Online from './online'
import Chat from './chat'

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uploaderShdBeShown: false
        };
        this.toggleUploader = this.toggleUploader.bind(this);
    }
    componentDidMount() {
        axios.get('/user').then( resp => {
            console.log("componentDidMount response", resp);
            this.setState({
                success: resp.data.success,
                id: resp.data.id,
                first: resp.data.first,
                last: resp.data.last,
                email: resp.data.email,
                pass: resp.data.pass,
                img: resp.data.img,
                bio: resp.data.bio
            })
        }).catch(e => {
            console.log("component did NOT mount!", e);
        })
    }
    toggleUploader() {
        console.log("running toggleUploader");
        this.setState({
            uploaderShdBeShown: !this.state.uploaderShdBeShown
        });
    }
    render() {
        if (!this.state.id) {
            return (
                <div>
                    Loading . . .
                    <img src="./giphy.gif" />
                </div>
            );
        }
        return (
            <BrowserRouter>
            <div id="app-container">
                <nav>
                    <Logo />
                    <ProfilePic
                        id={this.state.id}
                        first={this.state.first}
                        last={this.state.last}
                        img={this.state.img}
                        toggleUploader={this.toggleUploader}
                    />
                    <div className="division"></div>
                </nav>


                <div className="content">

                    {this.state.uploaderShdBeShown &&
                        <ProfilePicUpload
                            toggleUploader={this.toggleUploader}
                            changeImage={img => this.setState({img: img})}
                        />}


                        <div id="routes">
                            <Route exact
                                path="/"
                                render={() => (
                                    <Profile
                                        id={this.state.id}
                                        first={this.state.first}
                                        last={this.state.last}
                                        img={this.state.img}
                                        bio={this.state.bio}
                                    />
                                )}
                            />
                            <Route exact path="/user/:id" component={OtherProfile} />

                            <Friends otherUserId={this.state.otherUserId}/>
                        </div>



                </div>

                <div className="content2">
                    See who's online now :)
                </div>
                <Online />
                <Chat />

            </div>
            </BrowserRouter>
        );
    }
}
