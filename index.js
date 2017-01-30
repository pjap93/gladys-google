

module.exports = function (sails) {

    var connect = require('./lib/connect.js');
    var authenticate = require('./lib/authenticate.js');
    var getRedirectUrl = require('./lib/getRedirectUrl.js');
    var sync = require('./lib/calendar/calendar.sync.js');
    var setup = require('./lib/setup.js');

    return {
        setup,
        getRedirectUrl,
        authenticate,
        calendar: {
            sync
        }
    };
};