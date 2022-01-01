let events = {};
let EventBus = {
    dispatch: (event, data) => {
        if (!events[event]) return;
        for (let i = 0; i < events[event].length; i++) {
            events[event][i](data);
        }
    },
    subscribe: (event, callback) => {
        if (!events[event]) events[event] = [];
        events[event].push(callback);
    },
    unsubscribe: (event, callback) => {
        let index = -1;
        for (let i = 0; i < events[event].length; i++) {
            if (events[event][i] === callback) {
                index = i;
                break;
            }
        }
        if (index !== -1) {
            events[event].splice(index, 1);
        }
    }
};

module.exports = EventBus;