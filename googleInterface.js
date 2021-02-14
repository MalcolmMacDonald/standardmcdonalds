

const {GOOGLE_API_KEY} = require('./config');
const metadataAPIURL = 'https://maps.googleapis.com/maps/api/streetview/metadata?';
const imageAPIURL = 'https://maps.googleapis.com/maps/api/streetview?';
const geocodingAPIURL = 'https://maps.googleapis.com/maps/api/geocode/json?';
const separator = '&';
var https = require('https');
const size = 3000;
const radius = 1000;
const fov = 90;

var googleDataType = {
    Metadata:0,
    PanoramaImage:1,
    Geocoding:2
}


async function GetGoogleData(dataType, lat, long) {
    var url;
    switch (dataType) {
        case googleDataType.Metadata:
            url = GetMetadataURL(lat, long);
            break;
        case googleDataType.PanoramaImage:
            url = GetPanoramaImageURL(lat, long);
            break;
        case googleDataType.Geocoding:
            url = GetGeocodingURL(lat,long);
            break;
    }

    return await new Promise((resolve, reject) => {
        var outData = '';
        https.get(url, (res) => {
            res.on('data', (chunk) => {
                outData += chunk;
            });

            res.on('end', () => {
                var dataJSON = JSON.parse(outData);
                resolve(dataJSON);
            });
        });
    });

}

function GetMetadataURL(lat, long) {

    var locationString = 'location=' + lat + ',' + long;
    var keyString = 'key=' + GOOGLE_API_KEY;
    var radiusString = 'radius=' + radius.toString();

    return metadataAPIURL + locationString + separator + radiusString + separator + keyString;
}

 function GetPanoramaImageURL(lat, long) {

    var sizeString = 'size=' + size.toString() + 'x' + size.toString();
    var locationString = 'location=' + lat + ',' + long;
    var fovString = 'fov=' + fov.toString();
    var keyString = 'key=' + GOOGLE_API_KEY;
    var radiusString = 'radius=' + radius.toString();

    return imageAPIURL + sizeString + separator + locationString + separator + fovString + separator + radiusString + separator + keyString;
}
function GetGeocodingURL(lat, long ){
    var languageString = 'language=en'
    var locationString = 'latlng=' + lat + ',' + long;
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