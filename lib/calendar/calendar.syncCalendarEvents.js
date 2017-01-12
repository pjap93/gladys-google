var google = require('googleapis');
var Promise = require('bluebird');

module.exports = function(oauth2Client, calendar) {

    const googleCalendarInstance = google.calendar({
        version: 'v3',
        auth: oauth2Client
    });

    var getEvents = Promise.promisify(googleCalendarInstance.events.list);
    
    return gladys.paramUser.getValue(`GOOGLE_CALENDAR_NEXT_SYNC_${calendar.externalid}_EVENTS`, calendar.user).reflect()
        .then((inspection) => {
            
            if(inspection.isFulfilled()) {
                sails.log.info(`Google : Performing incremental sync on calendar ${calendar.externalid}`);

                return sync(getEvents, calendar, inspection.value());
            } else {
                sails.log.info(`Google : Performing full sync on calendar ${calendar.externalid}.`);

                // we clean the calendar first
                return gladys.calendar.clean(calendar)
                    .then(() => sync(getEvents, calendar));
            }
        });
};

function sync(getEvents, calendar, syncToken, pageToken){
    
    var params = {
        calendarId: calendar.externalid,
        singleEvents: true // recurring events are repeated
    };

    if(syncToken) {
        params.syncToken = syncToken;
    } else {
        
        // sync only events from last year max 
        var lastYear = new Date();
        lastYear.setFullYear(lastYear.getFullYear() - 1);
        params.timeMin = lastYear.toISOString();
    }

    if(pageToken) params.pageToken = pageToken;

    return getEvents(params)
        .then((result) => {
            sails.log.info(`Google : Syncing calendar ${calendar.externalid}, received ${result.items.length} events.`);
            
            // insert events in DB
            return gladys.calendar.createEvents(formatEvents(calendar, result.items))
                .then((newEvents) => {
                    sails.log.info(`Google : Successfully inserted ${newEvents.length} calendarEvents in Gladys database.`);
                    
                    // if the sync is finished, we save the nextSyncToken for the next incremental synchronization
                    if(result.nextSyncToken) return gladys.paramUser.setValue({name: `GOOGLE_CALENDAR_NEXT_SYNC_${calendar.externalid}_EVENTS`, user: calendar.user, value: result.nextSyncToken});
                    
                    // if the sync has still some events to download
                    if(result.nextPageToken) return sync(getEvents, calendar, syncToken, result.nextPageToken);
                });
        });
}

function formatEvents(calendar, googleEvents){
    var events = [];
    
    googleEvents.forEach((googleEvent) => {
        var newEvent = {
            externalid: googleEvent.id,
            name: googleEvent.summary,
            location: googleEvent.location,
            calendar: calendar.id
        };

        if(googleEvent.start && googleEvent.start.dateTime) newEvent.start = googleEvent.start.dateTime;
        if(googleEvent.start && googleEvent.start.date) newEvent.start = googleEvent.start.date;
        if(googleEvent.end && googleEvent.end.dateTime) newEvent.end = googleEvent.end.dateTime;
        if(googleEvent.end && googleEvent.end.date) newEvent.end = googleEvent.end.date;

        events.push(newEvent);
    });

    return events;
}