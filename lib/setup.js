var sync = require('./calendar/calendar.sync.js');

module.exports = function() {
    
    // start syncing calendar
    sync();

    return null;
};