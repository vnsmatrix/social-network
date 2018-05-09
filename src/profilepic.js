import React from 'react';
import axios from './axios';

export default function ProfilePic(props) {
    if (!props.id) {
        return null;
    }
    let pic = props.img;
    if(!pic) {
        pic = '/kitty3.gif'
    }
    return (
        <div id="profile-pic">
            <img onClick={props.toggleUploader} src={pic} alt={props.first} />
            {!props.img && <div id="change-profile-pic">Click on this kitty to change your profile pic :3 </div>}
            {props.img && <div id="qtest"><a href="/">Qtest kitty of them all! ---> </a></div>}
        </div>
    );
}
