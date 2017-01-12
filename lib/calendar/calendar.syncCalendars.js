var google = require('googleapis');
var Promise = require('bluebird');

module.exports = function(oauth2Client, user) {

    const googleCalendarInstance = google.calendar({
        version: 'v3',
        auth: oauth2Client
    });

    var getCalendars = Promise.promisify(googleCalendarInstance.calendarList.list);
    
    return gladys.paramUser.getValue(`GOOGLE_CALENDAR_NEXT_SYNC`, user.id).reflect()
        .then((inspection) => {
            
            if(inspection.isFulfilled()) {
                sails.log.info(`Google : Performing incremental sync of calendars.`);

                return sync(getCalendars, user, inspection.value());
            } else {
                sails.log.info(`Google : Performing full sync of calendars.`);

                return sync(getCalendars, user);
            }
        });
};

function sync(getCalendars, user, syncToken, pageToken){
    
    var params = {};

    if(syncToken) {
        params.syncToken = syncToken;
    } 

    if(pageToken) params.pageToken = pageToken;

    return getCalendars(params)
        .then((result) => {
            sails.log.info(`Google : Syncing calendars, received ${result.items.length} calendars.`);
            
            // insert events in DB
            return gladys.calendar.create(formatCalendars(user, result.items))
                .then((newCalendars) => {
                    sails.log.info(`Google : Successfully inserted ${newCalendars.length} calendarEvents in Gladys database.`);
                    
                    // if the sync is finished, we save the nextSyncToken for the next incremental synchronization
                    if(result.nextSyncToken) return gladys.paramUser.setValue({name: `GOOGLE_CALENDAR_NEXT_SYNC`, user: user.id, value: result.nextSyncToken});
                    
                    // if the sync has still some events to download
                    if(result.nextPageToken) return sync(getCalendars, user, syncToken, result.nextPageToken);
                });
        });
}

function formatCalendars(user, googleCalendars){
    var calendars = [];
    
    googleCalendars.forEach((googleCalendar) => {
        
        var newCalendar = {
            externalid: googleCalendar.id,
            name: googleCalendar.summary,
            service: 'google',
            user: user.id
        };

        calendars.push(newCalendar);
    });

    return calendars;
}