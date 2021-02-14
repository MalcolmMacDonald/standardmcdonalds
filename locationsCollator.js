var googleInterface = require('./googleInterface');
var fs = require('fs');
var dataFolder = './data';

var googleDataType = googleInterface.googleDataType;

async function GetAllLocations() {
    var allLocations = [];
    var folders = fs.readdirSync(dataFolder);
    for (var i = 0; i < folders.length; i++) {
        var folderPath = dataFolder + "/" + folders[i];
        var folderStat = fs.statSync(folderPath);
        if (folderStat.isDirectory()) {
            var files = fs.readdirSync(folderPath);
            for (var j = 0; j < files.length; j++) {
                allLocations = allLocations.concat(await FilterLocations(folderPath + "/" + files[j]));
            }
        }
    }
    removeDuplicates(allLocations);
    shuffleArray(allLocations);
    var goodLocationsText = JSON.stringify(allLocations);
    fs.writeFile(dataFolder + '/GoodLocations.json', goodLocationsText, (err) => {
    });
}


async function FilterLocations(filePath) {
    var useCollectedTechnique = filePath.includes('collected');

    var fileText = fs.readFileSync(filePath);
    var fileData = JSON.parse(fileText);

    var dataArray = [];
    if (useCollectedTechnique) {
        dataArray = fileData;
    } else {
        dataArray = fileData.features;
    }
    var goodLocations = [];
    for (var i = 0; i < dataArray.length; i++) {
        var lat;
        var long;
        if (useCollectedTechnique) {
            lat = dataArray[i].lat;
            long = dataArray[i].long;
        } else {
            lat = dataArray[i].geometry.coordinates[0];
            long = dataArray[i].geometry.coordinates[1];
        }
        if ((await googleInterface.RequestGoogleData(googleDataType.Metadata, lat, long)).status == 'OK') {
            goodLocations.push({lat: lat, long: long});
        }
    }
    return goodLocations;
}

async function TestGeocoding(){
    var savedLocations = JSON.parse(fs.readFileSync('./data/GoodLocations.json'));
    for(var i = 0; i < savedLocations.length; i++){
        var geoCodeData = await googleInterface.GetGoogleData(googleDataType.Geocoding, savedLocations[i].lat,savedLocations[i].long);
        var formattedAddress = geoCodeData.results[0].formatted_address;
        var postalCode = geoCodeData.results[0].address_components.find(component => component.types.some(type => type == "postal_code" ));
        if(postalCode){
            formattedAddress = formattedAddress.replace( ' ' + postalCode.long_name,'');
        }
        console.log(formattedAddress);
        //if(!formattedAddress.includes('USA')){
       // }
      //console.log(geoCodeData);
        //break;
    }
}

function removeDuplicates(array){
    return savedLocations.filter(function(item, pos, self) {
        return self.indexOf(item) == pos;
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


module.exports = {
    GetAllLocations,
    TestGeocoding
}