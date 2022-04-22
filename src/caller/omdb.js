const axios = require('axios');
const config = require('../config');

const client = axios.create({
    baseURL: 'http://www.omdbapi.com',
    timeout: 1000
  });

const getMovieByTitle = async ({ title }) => {
    try {
        const response = await client.get('/', {
            params: {
                apikey: config.get('imdb.api_key'),
                t: title
            }
        })

        const { data } = response;
        return data;
    } catch (err) {
        throw new Error(err);
    }
}

module.exports = {
    getMovieByTitle,
};