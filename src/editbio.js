import React from 'react';
import axios from './axios';

export default class EditBio extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editorVisible: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.submit = this.submit.bind(this);
    }
    handleChange(e) {
        this[e.target.name] = e.target.value;
    }
    submit() {
        axios
        .post('/editbio', {
            bio: this.bio
        })
        .then (resp => {
            console.log("resp axios post editbio", resp);
            if(resp.data.success) {
                console.log("success");
                console.log("resp.data.bio", resp.data.bio);
                location.replace('/')
            } else {
                this.setState({
                    error: resp.data.error
                });
            }
        })
    }
    render () {
        const editor= (
            <div id="editor">
                {this.state.error && <div className="errmsg">{this.state.error}</div>}
                <input name="bio" placeholder="Meow?" onChange={this.handleChange} />
                <button className="submitbtn" onClick={this.submit}>Submit</button>
            </div>
        )
        console.log("this.props.bio", this.props.bio);
        return (
            <div>
                <div id="editbio">
                    {!this.state.editorVisible &&
                        <div onClick={() => this.setState({editorVisible: true})}>Edit bio?</div>}
                    {this.state.editorVisible && editor}
                </div>
            </div>
        );
    }
}
