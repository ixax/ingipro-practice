import Layout from '../layout';
import Login from '../login';
import Users from '../users';
import Chat from '../chat';
import Popup from '../popup';
import mediator from '../mediator'; // instance of component
import '../store';
import '../voice';
import '../websocket';
import './style.css';

// create instanses of ui components
const layout = new Layout(document.querySelector('.layout'));
const login = new Login(document.querySelector('.login'));
const users = new Users(document.querySelector('.users'));
const chat = new Chat(document.querySelector('.chat'));
const popup = new Popup(document.querySelectorAll('.popup-locker'));

// init, show login form
login.show();

// wait to login
mediator.on('conference:sync', () => {
    login.hide();
    layout.show();
    users.show();
    chat.show();
    popup.show();

    document.querySelector('.wrapper').classList.remove('hide');
});

mediator.on('*', (data, type) => {
    /* eslint-disable no-console  */
    console.info(`Event type: ${type}`);
    console.info(data);
    /* eslint-enable no-console  */
});


