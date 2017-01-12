var queries = require('./calendar.queries.js');

module.exports = function() {
    return gladys.utils.sql(queries.getUsers, ['GOOGLE_API_REFRESH_TOKEN']);
};