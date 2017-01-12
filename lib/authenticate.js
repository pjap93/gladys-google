var getOauth2Client = require('./getOauth2Client.js');
var google = require('googleapis');

module.exports = function authenticate(code, user) {

    return getOauth2Client()
        .then((oauth2Client) => {
            
            oauth2Client.getToken(code, function (err, tokens) {
                if(err) return Promise.reject(new Error(err));

                return [
                    gladys.paramUser.setValue({name: 'GOOGLE_API_ACCESS_TOKEN', value: tokens.access_token, user: user.id}),
                    gladys.paramUser.setValue({name: 'GOOGLE_API_REFRESH_TOKEN', value: tokens.refresh_token, user: user.id})
                ];
            });
    });
};