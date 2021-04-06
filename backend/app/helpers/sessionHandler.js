const _ = require('lodash');

function addSession(app, userID, streamID) {
    const storage = app.get('users');
    const existingUser = _.find(storage, (u) => {
        if (u.id === userID) {
            u.streams = _.union(u.streams, [streamID]);
            return u;
        }
    });

    if (!existingUser) {
        storage.push({
            id: userID,
            streams: [streamID]
        });
    }

    app.set('users', storage);
}

function removeSession (app, userID, streamID) {

    const storage = app.get('users');
    const user = _.find(storage, (user) => user.id === userID);

    if (user) {
        _.remove(user.streams, (sid) => sid === streamID);
    }

    app.set('users', storage);
}

module.exports = {
    addSession,
    removeSession
};
