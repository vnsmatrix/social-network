import React from 'react';
import axios from './axios';
import ProfilePic from './profilepic';
import EditBio from './editbio'

export default function Profile(props) {
    if (!props.id) {
        return null;
    }
    console.log("profile props", props);
    return (
        <div id="profile">
            <div className="profilepic-in-profile">
                {props.img && <img src={props.img} />}
                {!props.img && <img src="/kitty3.gif" />}
            </div>
            <div id="profile-right">
                <div className="username-in-profile">
                    <h2>{props.first} {props.last}</h2>
                </div>

                <div className="bio">
                    <div id="bio-text">{props.bio}</div>
                    <EditBio
                        bio={props.bio}
                        />
                </div>
            </div>
        </div>
    )
}
