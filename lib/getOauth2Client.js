var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;

module.exports = function(user) {
    return gladys.paramUser.getValues([{name : 'GOOGLE_API_CLIENT_ID', user: user.id}, {name: 'GOOGLE_API_CLIENT_SECRET', user: user.id}, {name : 'GOOGLE_API_REDIRECT_URL', user: user.id}])
            .spread((clientId, clientSecret, redirectUrl) => {
                    
                    var oauth2Client = new OAuth2(
                        clientId,
                        clientSecret,
                        redirectUrl
                    );

                    return oauth2Client;
            });
}