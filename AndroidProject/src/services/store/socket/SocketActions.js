import Modifier from "../helpers/Modifier";

let modifier = new Modifier('socket');
const modifiers = {
    emit: modifier.name('emit'),
    destroy: modifier.name('destroy'),
}

class SocketActions {
    static actions = {
        [modifiers.emit]: (socket, action, store) => {
            socket.emit(action.payload.event, action.payload.data, action.payload.callback);
        },
        [modifiers.destroy]: (socket, action, store) => {
            socket.io.opts.query = {};
            socket.close();
        },
    };
}


export class SocketState {
    static emit(event, data, callback) {
        return {type: modifiers.emit, payload: {event: event, data: data, callback: callback}}
    }

    static destroy() {
        return {type: modifiers.destroy, payload: {}}
    }
}

export default SocketActions;
