var googleInterface = require('./googleInterface');
var twitterInterface = require('./twitterInterface');
var googleDataType = googleInterface.googleDataType;
var fs = require('fs');

async function BuildTweet(mcDonaldsIndex){
    var location = GetLocation(mcDonaldsIndex);
    var locationName = await GetLocationData(location);
    var locationPositionString = location.lat + ',' + location.long;
    
    
    var tweetText = locationName + "\n" + locationPositionString;
    var tweetImage = await googleInterface.GetGoogleData(googleDataType.PanoramaImage,location);
    
    var tweetData = {
        image: tweetImage,
        text: tweetText
    }
    
    return tweetData;    
}

async function GetLocationData(location){
        var geoCodeData = await googleInterface.GetGoogleData(googleDataType.Geocoding, location);
        var formattedAddress = geoCodeData.results[0].formatted_address;
        var postalCode = geoCodeData.results[0].address_components.find(component => component.types.some(type => type == "postal_code" ));
        if(postalCode){
            formattedAddress = formattedAddress.replace( ' ' + postalCode.long_name,'');
        }
        return formattedAddress;
}


function GetLocation(mcDonaldsIndex){
    var savedLocations = JSON.parse(fs.readFileSync('./data/GoodLocations.json'));
    return savedLocations[mcDonaldsIndex];
}

module.exports = {
    BuildTweet
}