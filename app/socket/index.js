const store = require('../store');

module.exports = function (server) {
    const io = require('socket.io').listen(server, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
    });

    io.sockets.on('connection', (socket) => {

        socket
            .on('main', ({type, payload}) => {

                if (!(/^[a-z]+:[a-z]+$/.test(type))) {
                    socket.emit('main', {
                        type: 'conference:fail',
                        message: `Wrong type: ${type}`,
                    });
                }

                switch (type) {
                    case 'user:join':
                        const data = store.userAdd(payload.name);
                        socket.id = data.userList[data.userList.length - 1].userId;
                        socket.emit('main', {
                            type: 'conference:sync',
                            payload: data,
                        });
                        socket.broadcast.emit('main', {
                            type: 'conference:join',
                            payload: data.userList[data.userList.length - 1],
                        });
                        break;
                    case 'canvas:lock':
                        if (store.lock(payload.userId)) {
                            socket.emit('main', {type: 'lock:accept'});
                            io.emit('main', {
                                type: 'conference:lock',
                                payload: store.getUser(payload.userId),
                            });
                        } else {
                            socket.emit('main', {type: 'lock:denied'});
                        }
                        break;
                    case 'canvas:unlock':
                        store.unlock(payload.userId);
                        io.emit('main', {
                            type: 'conference:unlock',
                        });
                        break;
                    case 'chat:message':
                        socket.broadcast.emit('main', {type, payload});
                        break;
                    default:
                        if (store.addData(type, payload)) {
                            socket.broadcast.emit('main', {type, payload});
                        } else {
                            socket.emit('main', {type: 'access:denied'});
                        }
                }
            })
            .on('disconnect', () => {
                const user = store.userDel(socket.id);
                socket.broadcast.emit('main', {
                    type: 'conference:leave',
                    payload: user,
                });
            })
            .on('error', (error) => {
                socket.emit('main', {
                    type: 'conference:fail',
                    message: error,
                });
            });
    });

    return io;
};
