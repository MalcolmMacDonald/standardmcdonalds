const config = require('./config');
const twit = require('twit');
const T = new twit(config);


module.exports = {

    tweet: function (tweet) {
        return new Promise(resolve => {

            T.post('media/upload', { media_data: tweet.image }, function (err, data, response) { 
                var params = { status: tweet.text, media_ids: data.media_id_string }

                T.post('statuses/update', params, function (err, data, response) {
                    resolve();
                })

            });
        });
    },
    getBio: function (){
        return new Promise(resolve => {
           T.get('users/show', {user_id:1361106394611548161,screen_name:'standard_mcd' },function(err, data, response) {
               console.log(data.description);
               resolve(data.description);
            }); 
        });
    },
    setBio: function (text){
        return new Promise(resolve => {
            T.post('account/update_profile', {description:text},function(err, data, response) {
                console.log(err);
                resolve();
            });
        });
    }
}