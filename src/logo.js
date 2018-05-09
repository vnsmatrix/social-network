import React from 'react';

export default function Logo() {
    return (
        <div id="logo">
            <div id="logo-logout"> Click on these kitties to log out :( </div>
            <a href="/logout">
                <img src="/kitties.gif"/>
            </a>
        </div>
    );
}
