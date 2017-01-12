var getOauth2Client = require('./getOauth2Client.js');

module.exports = function connect(user){

    return getOauth2Client()
        .then((oauth2Client) => {
   
                return [oauth2Client, gladys.paramUser.getValues([{name: 'GOOGLE_API_ACCESS_TOKEN', user: user.id}, {name: 'GOOGLE_API_REFRESH_TOKEN', user: user.id}])];
        })
        .spread((oauth2Client, result) => {
             
            oauth2Client.setCredentials({
                access_token: result[0],
                refresh_token: result[1]
            });

            return oauth2Client;
        }); 
};