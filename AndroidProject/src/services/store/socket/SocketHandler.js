import SocketEventHandler from "./handlers/SocketEventHandler";

class SocketHandler {

    static handlers = [
        SocketEventHandler,
    ];

    static bind(store, socket) {
        let events = {};
        for (let i = 0; i < SocketHandler.handlers.length; i++) {
            let Handler = SocketHandler.handlers[i];
            let keys = Object.keys(Handler.events);

            for (let j = 0; j < keys.length; j++) {
                events[keys[j]] = Handler.events[keys[j]];
            }
        }

        let keys = Object.keys(events);
        for (let i = 0; i < keys.length; i++) {
            console.log('socket registered for', keys[i], 'event');
            socket.on(keys[i], async (...args) => {
                await events[keys[i]](socket, store, ...args);
            });
        }
    }
}

export default SocketHandler;
