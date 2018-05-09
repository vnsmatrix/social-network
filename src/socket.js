import * as io from 'socket.io-client';
import { onlineUsers, userJoined, userLeft, chatMessage, mostRecentTenMessages } from './actions';

let socket;

export default function initSocket(store) {
    if (!socket) {
        socket = io.connect();

        socket.on('onlineUsers', (data) => {
            store.dispatch(onlineUsers(data));
        });

        socket.on('userJoined', (data) => {
            store.dispatch(userJoined(data));
        });

        socket.on('userLeft', (data) => {
            store.dispatch(userLeft(data));
        });

        socket.on('chatMessage', data => {
            store.dispatch(chatMessage(data));
        });

        socket.on('mostRecentTenMessages', data => {
            console.log("chatmsg");
            store.dispatch(mostRecentTenMessages(data));
        });

    }
    return socket;
}

export function emit(eventName, data) {
    socket.emit(eventName, data)
}
