var sync = require('./calendar/calendar.sync.js');
const Promise = require('bluebird');

module.exports = function() {
    
    // start syncing calendar
    sync();

    return Promise.resolve();
};