export function reducer (state = {}, action) {
    if(action.type == 'NEW_CHAT_MESSAGE') {
        console.log(state.messages);
        return { ...state, messages: [...state.messages, action.newMessage]}
    }

    if(action.type == 'LATEST_TEN') {
        return { ...state, messages: action.messages}
    }

    if(action.type == 'GET_ONLINE_USERS') {
        let loggedInUsers = action.users
        return { ...state, loggedInUsers}
    }

    if(action.type == 'GET_LOGGEDIN_USER') {
        let loggedInId = action.user
        return { ...state, loggedInId}
    }

    if(action.type == 'GET_LOGGEDOUT_USER') {
        let loggedOutId = action.user
        return { ...state, loggedOutId}
    }

    if(action.type == 'RECEIVE_FRIENDS_WANNABES') {
        let loggedUserId = action.loggedUser
        return { ...state, friendsAndWannabes: action.users, loggedUserId}
    }

    if(action.type == 'ACCEPT_FRIEND_REQUEST') {
        return { ...state,
            friendsAndWannabes: state.friendsAndWannabes.map( user => {
                if (user.id != action.id) {
                    return user;
                } else {
                    return {
                        ...user,
                        status: 2
                    }
                }
            })
        }
    }

    if(action.type == 'UNFRIEND') {
        return { ...state,
            friendsAndWannabes: state.friendsAndWannabes.map( user => {
                if (user.id != action.id) {
                    return user;
                } else {
                    return {
                        ...user,
                        status: 4
                    }
                }
            })
        }
    }

    return state;
}
