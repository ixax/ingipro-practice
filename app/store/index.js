const randomColor = require('randomcolor');
const uuidv4 = require('uuid/v4');
const store = {
    userList: [],
};
let lock = false;
let userLock;

exports.getUser = function (userId) {
    for (let i = 0; i < store.userList.length; i++){
        if (store.userList[i].userId === userId) {
            return store.userList[i];
        }
    }
};

exports.userAdd = function (login) {
    const id = uuidv4();
    store.userList.push({
        userId: id,
        name: login,
        color: randomColor({luminosity: 'light'}),
    });

    return store;
};

exports.userDel = function (userId) {
    for (let i = 0; i < store.userList.length; i++){
        if (store.userList[i].userId === userId){
            const user = store.userList[i];
            store.userList.splice(i, 1);
            return user;
        }
    }
    return null;
};

exports.lock = function (userId) {
    if (!lock) {
        userLock = userId;
        lock = true;
        return true;
    }
    return false;
};

exports.unlock = function (userId) {
    if (lock && userLock === userId) {
        lock = false;
    }
};

exports.addData = function (type, payload) {
    //@fixme remove `comments`
    //if (lock && userLock === payload.userId){
        store[type] = payload;
        return true;
    //}
    return false;
};
