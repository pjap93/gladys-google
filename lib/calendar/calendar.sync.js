const getUsers = require('./calendar.getUsers.js');
const syncUser = require('./calendar.syncUser.js');
const Promise = require('bluebird');

module.exports = function (){
    return getUsers()
        .then((users) => {
            sails.log.info(`Google : Calendar : Syncing ${users.length} users.`);
            
            return Promise.map(users, function(user) {
                return syncUser(user)
                    .catch((err) => {
                        sails.log.warn(`Google : Calendar : Unable to sync user ID${user.id}. ${err}`);
                    });
            }, {concurrency: 1});
        });
};