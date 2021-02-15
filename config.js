const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    consumer_key: process.env.TWITTER_API_KEY,

    consumer_secret: process.env.TWITTER_API_SECRET_KEY,

    access_token: process.env.TWITTER_ACCESS_TOKEN,

    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
}