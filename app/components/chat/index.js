import './style.css';
import mediator from '../mediator';

class Chat {
    constructor(domNode) {
        this._domNode = domNode;

        this._text = document.querySelector('.chat-message');

        this._input = document.querySelector('.chat-input');
        this._input.value = '';

        this._submit = document.querySelector('.chat-submit');
        this._submit.addEventListener('click', this._send.bind(this));

        mediator.on('conference:sync', this._getUserName.bind(this));
        mediator.on('chat:message', this._addMessage.bind(this));
    }

    hide() {
        this._domNode.classList.add('hide');
    }

    show() {
        this._domNode.classList.remove('hide');
    }

    _addMessage(payload) {
        if(!payload._fromServer) {
            return;
        }

        const newMessage = document.createElement('div');
        newMessage.className = 'message';
        this._text.appendChild(newMessage);

        const userName = document.createElement('span');
        userName.innerHTML = `${payload.userName} - `;
        newMessage.appendChild(userName);

        const time = document.createElement('span');
        const date = new Date;
        time.innerHTML = `${date.toLocaleString()}:<br>`;
        newMessage.appendChild(time);

        const message = document.createElement('span');
        message.innerHTML = payload.message;
        newMessage.appendChild(message);
    }

    _send(event) {
        event.preventDefault();

        if (this._input.value === '') {
            return;
        }

        const payload = {};
        payload.userName = this.userName;
        payload.message = this._input.value;
        mediator.emit('chat:message', payload);
        this._input.value = '';
    }

    _getUserName(obj) {
        this.userName = obj.userList[obj.userList.length - 1].name;
    }
}

export default Chat;
