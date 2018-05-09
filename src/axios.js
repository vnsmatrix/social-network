//PREVENTING CSRF (Cross-Site Request Forgery)

import axios from 'axios';

var instance = axios.create({
    xsrfCookieName: 'mytoken',
    xsrfHeaderName: 'csrf-token'
});

export default instance;
