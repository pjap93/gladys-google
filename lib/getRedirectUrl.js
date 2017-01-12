var getOauth2Client = require('./getOauth2Client.js');

var scopes = [
  'https://www.googleapis.com/auth/calendar'
];

module.exports = function getRedirectUrl(){

    return getOauth2Client()
        .then((oauth2Client) => {
            
            var url = oauth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: scopes
            });

            return url;
        });
};