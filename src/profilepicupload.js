import React from 'react';
import axios from './axios';

export default class ProfilePicUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.setFile = this.setFile.bind(this);
        this.upload = this.upload.bind(this);
    }
    setFile(e) {
        this.setState({
            img: e.target.files[0]
        },() => console.log(this.state))
    }
    upload() {
        var formData = new FormData();
        formData.append('file', this.state.img)
        axios.post('/upload', formData).then(resp => {
            if (resp.data.success) {
                this.props.changeImage(resp.data.img);
                this.props.toggleUploader();
            }
        })
    }
    render() {
        return (
            <div id="profile-pic-upload">
                <input type="file" name="image" onChange={this.setFile} />
                <button onClick={this.upload}>SUBMIT</button>
            </div>
        );
    }
}
