import React from 'react';
import axios from './axios';
import { connect } from 'react-redux';
import { newMessage, mostRecentTenMessages } from './actions';
import { Link } from 'react-router-dom'
import { emit } from './socket'

function mapStateToProps(state) {
    return {
        chat: state.messages || []
    }
}

class Chat extends React.Component {
    constructor(props) {
        super(props);
        console.log("props Chat", props);
        this.state = {
            chatBoxShdBeShown: false
        };
        this.toggleChat = this.toggleChat.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    toggleChat() {
        console.log("running toggleChat");
        this.setState({
            chatBoxShdBeShown: !this.state.chatBoxShdBeShown
        });
    }

    handleChange(e) {
        this[e.target.name] = e.target.value;
    }

    handleKeyPress(event) {
        if(event.key == 'Enter'){
            console.log("enter key down!");
            emit('chatMessage', this.chatInput)
            event.target.value = '';
            event.preventDefault();
        }
    }

    componentDidUpdate() {
        console.log("componentDidUpdate!");
        // this.chatbox.scrollTop =
    }

    render () {
        console.log("chat render this.props", this.props);
        return (
            <div className="chat">
                {!this.state.chatBoxShdBeShown && <button className="chat-btn" onClick={this.toggleChat}>Chat (offline)</button>}
                {this.state.chatBoxShdBeShown &&
                    <div>
                        <div id="chat-modal">
                            <div id="chatbox" ref={elem => this.chatbox = elem}>

                                {this.props.chat.map(msg => {
                                    console.log(msg);
                                    return (
                                        <div key={msg.text} className="chat-messages">
                                            <Link to={`/user/${msg.id}`}>
                                                {msg.img && <img src={msg.img} />}
                                                {!msg.img && <img src="/kitty3.gif" />}
                                            </Link>
                                            <div className="chat-user">
                                                <Link to={`/user/${msg.id}`}>
                                                    {msg.first} {msg.last}
                                                </Link>
                                            </div>
                                            <div className="chat-text">
                                                    {msg.text}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            <textarea id="chat-input" name="chatInput" onChange={this.handleChange} onKeyPress={this.handleKeyPress}></textarea>
                        </div>
                        <button className="chat-btn" onClick={this.toggleChat}>Chat (online)</button>
                    </div>
                }
            </div>

        )
    }
}

//MUST BE AFTER CLASS COMPONENT!
export default connect (mapStateToProps)(Chat);
