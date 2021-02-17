//initial count 13828
//new count 21488
const totalMcDonalds = 21488;
var tweetBuilder = require('./tweetBuilder');
var twitterInterface = require('./twitterInterface');


TweetStandardMcDonalds();



async function TweetStandardMcDonalds(){

    var currentMcDonaldsCount = await GetCurrentMcDonaldsCount();
    
    if(currentMcDonaldsCount == (totalMcDonalds-1)){
        return;
    }
   
    var tweetData = await tweetBuilder.BuildTweet(currentMcDonaldsCount);
    await twitterInterface.tweet(tweetData);
    
    currentMcDonaldsCount += 1;
    var newBio = `A bot documenting the less exciting McDonald's.\nTweets not endorsements.\nAdmin: @mal_loc\nnonstandard mcdonald's: @nonstandardmcd\nMcDonald's Posted: ${numberWithCommas(currentMcDonaldsCount)}/${numberWithCommas(totalMcDonalds)}`;
    await twitterInterface.setBio(newBio);
}

async function GetCurrentMcDonaldsCount(){
    var currentBio = await twitterInterface.getBio();
    var currentMcDonaldsCount = currentBio.split('/')[0];
    currentMcDonaldsCount = currentMcDonaldsCount.split(' ');
    currentMcDonaldsCount = currentMcDonaldsCount[currentMcDonaldsCount.length-1];
    currentMcDonaldsCount = currentMcDonaldsCount.replace(',','');
    currentMcDonaldsCount = parseInt(currentMcDonaldsCount);
    return currentMcDonaldsCount;
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
//

