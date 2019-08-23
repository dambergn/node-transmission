'use strict';

const fs = require('fs');
const storage = require('./storage.js')

exports.horribleSubsTimeStamp = 0;
exports.golumpaTimeStamp = 0;
exports.kaidubs = {
  dragonBallSuperTS : 0,
  mobileSuitGundamTS : 0,
  borutoTS : 0,
  lupin3PVTS : 0,
  attackOnTitanS3TS : 0,
}

exports.updateLTS = function () {
  let storageJSON = {
    golumpaTimeStamp : storage.golumpaTimeStamp,
    horribleSubsTimeStamp : storage.horribleSubsTimeStamp,
    kaidubs : {
      dragonBallSuperTS : storage.kaidubs.dragonBallSuperTS,
      mobileSuitGundamTS : storage.kaidubs.mobileSuitGundamTS,
      boruto : storage.kaidubs.borutoTS,
      lupin3PVTS : storage.kaidubs.lupin3PVTS,
      attackOnTitanS3TS : storage.kaidubs.attackOnTitanS3TS,
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
    // console.log("LTS loading:", loadStorage)
    storage.horribleSubsTimeStamp = loadStorage.horribleSubsTimeStamp;
    storage.golumpaTimeStamp = loadStorage.golumpaTimeStamp;
    storage.kaidubs.dragonBallSuperTS = loadStorage.kaidubs.dragonBallSuperTS;
    storage.kaidubs.mobileSuitGundamTS = loadStorage.kaidubs.mobileSuitGundamTS;
    storage.kaidubs.borutoTS = loadStorage.kaidubs.boruto;
    storage.kaidubs.lupin3PVTS = loadStorage.kaidubs.lupin3PVTS;
    storage.kaidubs.attackOnTitanS3TS = loadStorage.kaidubs.attackOnTitanS3TS;
  })
  console.log('LTS loaded')
}
loadLTS();