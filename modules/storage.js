'use strict';

const fs = require('fs');
const storage = require('./storage.js')

exports.horribleSubsTimeStamp = 0;

exports.updateLTS = function () {
  let storageJSON = {
    horribleSubsTimeStamp : storage.horribleSubsTimeStamp,
  }
  let data = JSON.stringify(storageJSON);
  fs.writeFileSync('./modules/storage.json', data);
}

function loadLTS() {
  fs.readFile('./modules/storage.json', (err, data) => {
    if(err) throw err;
    let loadStorage = JSON.parse(data);
    storage.horribleSubsTimeStamp = loadStorage.horribleSubsTimeStamp;
  })
  console.log('LTS loaded')
}
loadLTS();