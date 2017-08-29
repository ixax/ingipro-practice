import './style.css';
import mediator from '../mediator';

class Users {
    constructor(domNode) {
        this._domNode = domNode;

        mediator.on('conference:sync', this._showUsers.bind(this));
        mediator.on('conference:join', this._addUser.bind(this));
        mediator.on('conference:leave', this._deleteUser.bind(this));
    }

    hide() {
        this._domNode.classList.add('hide');
    }

    show() {
        this._domNode.classList.remove('hide');
    }

    _showUsers(payload) {
	  	payload.userList.forEach(item => this._showUser(item));
	}

    _showUser(item) {
	    const newUser = document.createElement('div');
	    newUser.id = item.userId;
	    newUser.className = 'user';
	    this._domNode.appendChild(newUser);

	   	const userColor = document.createElement('div');
	    userColor.className = 'userColor';
	    userColor.innerHTML = '●';
	    userColor.style.color = item.color;
	    newUser.appendChild(userColor);

	    const userName = document.createElement('div');
	    userName.className = 'userName';
	    userName.innerHTML = item.name;
	    newUser.appendChild(userName);
	}

    _addUser(payload) {
	    this._showUser(payload);
	}

    _deleteUser(payload) {
	    this._domNode.getElementById(payload.userId).remove();
	}
}

export default Users;
