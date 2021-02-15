

const {GOOGLE_API_KEY} = require('./config');
const metadataAPIURL = 'https://maps.googleapis.com/maps/api/streetview/metadata?';
const imageAPIURL = 'https://maps.googleapis.com/maps/api/streetview?';
const geocodingAPIURL = 'https://maps.googleapis.com/maps/api/geocode/json?';
const separator = '&';
var https = require('https');
const width = 600;
const height = 400;
const radius = 1000;
const fov = 120;

var googleDataType = {
    Metadata:0,
    PanoramaImage:1,
    Geocoding:2
}


async function GetGoogleData(dataType, location) {
    var url;
    switch (dataType) {
        case googleDataType.Metadata:
            url = GetMetadataURL(location);
            break;
        case googleDataType.PanoramaImage:
            url = GetPanoramaImageURL(location);
            break;
        case googleDataType.Geocoding:
            url = GetGeocodingURL(location);
            break;
    }
    
    console.log(url);

    return await new Promise((resolve, reject) => {
        var outData = '';
        https.get(url, (res) => {
            if(dataType == googleDataType.PanoramaImage){
            res.setEncoding('base64');
            }
            res.on('data', (chunk) => {
                outData += chunk;
            });

            res.on('end', () => {
                switch(dataType){
                    case googleDataType.PanoramaImage:
                        resolve(outData);
                        break;
                    default:
                        resolve(JSON.parse(outData));
                        break;
                }
            });
        });
    });

}

function GetMetadataURL(location) {

    var locationString = 'location=' + location.lat + ',' + location.long;
    var keyString = 'key=' + GOOGLE_API_KEY;
    var radiusString = 'radius=' + radius.toString();

    return metadataAPIURL + locationString + separator + radiusString + separator + keyString;
}

 function GetPanoramaImageURL(location) {

    var sizeString = 'size=' + width.toString() + 'x' + height.toString();
    var locationString = 'location=' + location.lat + ',' + location.long;
    var fovString = 'fov=' + fov.toString();
    var keyString = 'key=' + GOOGLE_API_KEY;
    var radiusString = 'radius=' + radius.toString();

    return imageAPIURL + sizeString + separator + locationString + separator + fovString + separator + radiusString + separator + keyString;
}
function GetGeocodingURL(location){
    var languageString = 'language=en'
    var locationString = 'latlng=' + location.lat + ',' + location.long;
    var keyString = 'key=' + GOOGLE_API_KEY;
    var resultTypes = [
        'locality','political'
    ]
    var resultTypeString = 'result_type=' + resultTypes.join('|'); //'political|country';
    return geocodingAPIURL + languageString + separator + locationString + separator + keyString + separator + resultTypeString;
}

module.exports = {
    GetGoogleData,
    googleDataType
}