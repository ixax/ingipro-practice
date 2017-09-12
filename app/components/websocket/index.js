'use strict';

import io from 'socket.io-client';
import Mediator from '../mediator';

class WebSocket {
    constructor() {
        this._socket = io.connect({
            path: '/ws',
            transports: ['websocket'],
        });

        this._socket.on( 'main', this.socketEmitMediator.bind(this) );                           //Recv from Server

        Mediator.on('*', this.socketOnMediator.bind(this));
    }

    socketOnMediator(data, type) {
        if (data._fromServer) {
            return;
        } else {                                                                                 //Send on Server
            this._socket.emit('main', { type, payload: data });
        }
    }

    socketEmitMediator(data) {
        const {type, payload = {}} = data;
        
        payload._fromServer = true;

        Mediator.emit(type, payload);
    }
}

// kind of Singleton pattern
export default new WebSocket();
