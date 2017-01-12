const connect = require('../connect.js');
const syncCalendars = require('./calendar.syncCalendars.js');
const syncCalendarEvents = require('./calendar.syncCalendarEvents.js');
const Promise = require('bluebird');

module.exports = function(user) {
    var oauth2Client;
    
    // first get the oauth2Client
    return connect(user)
        .then((client) => {
            oauth2Client = client;

            // sync all calendars
            return syncCalendars(oauth2Client, user);
        })
        .then(() => {

            // get all calendars in DB
            return gladys.calendar.getByService('google');
        })
        .then((calendars) => {

            // foreach calendar, sync events
            return Promise.map(calendars, function(calendar) {
                return syncCalendarEvents(oauth2Client, calendar)
                        .catch((err) => {
                            sails.log.warn(`Google : Calendar : Failed to sync calendar ${calendar.name} with externalid ${calendar.externalid}. ${err}`);
                        });
            }, {concurrency: 1});
        });
};