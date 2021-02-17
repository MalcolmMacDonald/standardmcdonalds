var googleInterface = require('./googleInterface');
var fs = require('fs');
var dataFolder = './data';

var googleDataType = googleInterface.googleDataType;

async function GetAllLocations(oldLocations) {
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
    
    var justNewLocations = allLocations.filter(function(item, pos, self) {
        return !oldLocations.includes(item);
    });
    
    allLocations = oldLocations.concat(justNewLocations);
    
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

        var location = {lat:0,long:0};
        if (useCollectedTechnique) {
            location.lat = dataArray[i].lat;
            location.long = dataArray[i].long;
        } else {
            location.lat = dataArray[i].geometry.coordinates[1];
            location.long = dataArray[i].geometry.coordinates[0];
        }
        if ((await googleInterface.GetGoogleData(googleDataType.Metadata,location)).status == 'OK') {
            goodLocations.push(location);
        }
    }
    return goodLocations;
}

function removeDuplicates(array){
    return array.filter(function(item, pos, self) {
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
    GetAllLocations
}