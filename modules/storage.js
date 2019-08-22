'use strict';

const fs = require('fs');
const storage = require('./storage.js')

exports.horribleSubsTimeStamp = 0;
exports.golumpaTimeStamp = 0;
exports.kaidubs = {
  dragonBallSuperTimeStamp : 0,
}

exports.updateLTS = function () {
  let storageJSON = {
    golumpaTimeStamp : storage.golumpaTimeStamp,
    horribleSubsTimeStamp : storage.horribleSubsTimeStamp,
    kaidubs : {
      dragonBallSuperTimeStamp : storage.dragonBallSuperTimeStamp,
    }
  }
  let data = JSON.stringify(storageJSON);
  fs.writeFileSync('./modules/storage.json', data);
}

try {
  if (!fs.existsSync('storage.json')) {
    storage.updateLTS();
  }
} catch (err) { console.error(err) }

function loadLTS() {
  fs.readFile('./modules/storage.json', (err, data) => {
    if(err) throw err;
    let loadStorage = JSON.parse(data);
    storage.horribleSubsTimeStamp = loadStorage.horribleSubsTimeStamp;
  })
  console.log('LTS loaded')
}
loadLTS();