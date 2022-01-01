import {CompanyState} from "../../store/reducers/CompanyReducer";
import {UserState} from "../../store/reducers/UserReducer";
import {MainState} from "../../reducers/MainReducer";
import EventBus from "../../../events/EventBus";

class SocketEventHandler {
    static events = {
        'connect': async (socket, store) => {
            // store.dispatch({
            //     type: ActionTypes.SET_CONNECTIVITY,
            //     payload: {
            //         isConnected: true,
            //         isConnecting: false,
            //     }
            // });
            console.log('socket: connected');
        },
        'disconnect': async (socket, store) => {
            console.log(`socket: disconnected!`);
        },
        'error': async (socket, store, error) => {
            console.log(`socket: ${error}`);
        },
        'user.update': async (socket, store, data) => {
            await store.dispatch(MainState.setUser(data.user));
        },
        'users.update': async (socket, store, data) => {
            await store.dispatch(MainState.setUsers(data.users));
        },
        'call.update': async (socket, store, data) => {
            if (store.getState().main.user.username === data.call.from || store.getState().main.user.username === data.call.to) {
                await store.dispatch(MainState.setCall(data.call));

                if (data.call.status === 'declined' || data.call.status === 'canceled') {
                    setTimeout(()=> {
                        store.dispatch(MainState.setCall(null));
                    }, 3000);
                }
            }
        },
        'signaling': async (socket, store, data) => {
            if (store.getState().main.user.username === data.to) {
                EventBus.dispatch("signaling", data.message);
            }
        },
    };
}

export default SocketEventHandler;
