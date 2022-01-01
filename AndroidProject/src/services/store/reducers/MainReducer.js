import Modifier from "../helpers/Modifier";

let modifier = new Modifier('main');

const modifiers = {
    setUser: modifier.name('setUser'),
    setUsers: modifier.name('setUsers'),
    setFocusedUser: modifier.name('setFocusedUser'),
    setCall: modifier.name('setCall'),
}

const initialState = {
    user: null,
    users: null,
    focusedUser: null,
    call: null,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case modifiers.setUser:
            return {
                ...state,
                user: action.payload.user,
            }
        case modifiers.setUsers:
            return {
                ...state,
                users: action.payload.users,
            }
        case modifiers.setFocusedUser:
            return {
                ...state,
                focusedUser: action.payload.user,
            }
        case modifiers.setCall:
            return {
                ...state,
                call: action.payload.call,
            }
        default:
            return state
    }
};

export class MainState {
    static setUser = (user) => {
        return {type: modifiers.setUser, payload: {user: user}};
    }

    static setUsers = (users) => {
        return {type: modifiers.setUsers, payload: {users: users}};
    }

    static setFocusedUser = (user) => {
        return {type: modifiers.setFocusedUser, payload: {user: user}};
    }

    static setCall = (call) => {
        return {type: modifiers.setCall, payload: {call: call}};
    }
}

export default reducer;
