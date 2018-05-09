import axios from './axios';

//chat:
export function chatMessage(newMessage) {
    return {
        type: 'NEW_CHAT_MESSAGE',
        newMessage
    };
}

export function mostRecentTenMessages(messages) {
    return {
        type: 'LATEST_TEN',
        messages
    };
}

//online users:
export function onlineUsers(users) {
    return {
        type: 'GET_ONLINE_USERS',
        users
    };
}

export function userJoined(user) {
    return {
        type: 'GET_LOGGEDIN_USER',
        user
    };
}

export function userLeft(user) {
    return {
        type: 'GET_LOGGEDOUT_USER',
        user
    };
}

//friend button in Friends list:
export async function receiveFRList() {
    const { data } = await axios.get('/listFR');
    return {
        type: 'RECEIVE_FRIENDS_WANNABES',
        users: data.users,
        loggedUser: data.loggedUser
    };
}

export async function acceptFR(id) {
    const { data } = await axios.post('/acceptFR', {
        otherUserId: id
    });
    return {
        type: 'ACCEPT_FRIEND_REQUEST',
        users: data.users,
        id

    };
}

export async function unfriend(id) {
    const { data } = await axios.post('/deleteFR', {
        otherUserId: id
    });
    return {
        type: 'UNFRIEND',
        users: data.users,
        id
    };
}
