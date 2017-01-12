var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;

module.exports = function() {
    return gladys.param.getValues(['GOOGLE_API_CLIENT_ID', 'GOOGLE_API_CLIENT_SECRET', 'GOOGLE_API_REDIRECT_URL'])
            .spread((clientId, clientSecret, redirectUrl) => {
                    
                    var oauth2Client = new OAuth2(
                        clientId,
                        clientSecret,
                        redirectUrl
                    );

                    return oauth2Client;
            });
}