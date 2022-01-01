import SocketHandler from "./SocketHandler";
import SocketActions from "./SocketActions";
import io from "socket.io-client";

const SocketMiddleware = () => {
    return (store) => {

        let socket = io('http://192.168.1.45:3000');
        SocketHandler.bind(store, socket);

        return next => action => {
            if (SocketActions.actions[action.type]) {
                return SocketActions.actions[action.type](socket, action, store);
            }

            return next(action);
        };
    };
};

export default SocketMiddleware;
