const convict = require('convict');

const config = convict({
    imdb: {
        api_key: process.env.IMDB_API_KEY || ''
    },
    database: {
        url: process.env.DB_URL
    }
});

module.exports = config;