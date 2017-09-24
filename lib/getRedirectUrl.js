var getOauth2Client = require('./getOauth2Client.js');

var scopes = [
  'https://www.googleapis.com/auth/calendar'
];

module.exports = function getRedirectUrl(user){

    return getOauth2Client(user)
        .then((oauth2Client) => {
            
            var url = oauth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: scopes
            });
            gladys.message.send({id: null}, {text:  `url google : ${url}`, receiver: user.id});
            return url;
        });
};