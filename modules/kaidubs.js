'use strict';

const fs = require('fs');
require('dotenv').config();
const { si, pantsu } = require('nyaapi')
const cmd = require('node-cmd');
const storage = require('./storage.js')

const kaidubs = require('./kaidubs.js')

// let lastTimeStamp = 0;

exports.Update = function (request, path) {
  si.search(request, 5, {
    filter: 0,
  })
    .then((data) => {
      let results = []
      for (let i = 0; i < data.length; i++) {
        let episode = {
          name: data[i].name,
          timestamp: data[i].timestamp,
          torrent: data[i].links.file,
          magnet: data[i].links.magnet
        }
        results.push(episode);
      }
      console.log('KaiDubs:', results)
      // timeStampCheck(results, path) // Enable to download
    }).catch((err) => console.log(err))
}

const username = process.env.TRANS_USER
const password = process.env.TRANS_PASSWORD

function transmissionDownload(url, path){
  return `transmission-remote -n '${username}:${password}' -a ${url} -ph -w ${path}`
}

function addTorrent(url, path, name){
  cmd.get(transmissionDownload(url, path), function (err, data, stderr) {
    // if(err)console.log('err: ', err);
    // if(stderr)console.log('stderr: ', stderr);
    console.log('success:', data);
    console.log('added: ', name);
  });
}

function timeStampCheck(torrentList, path){
  let reversedList = [];
  for(let i = torrentList.length; i > 0 ; i--){
    if(torrentList[i-1].timestamp >= storage.kaidubsTimeStamp + 1){
      console.log(torrentList[i-1].timestamp, 'to' ,storage.kaidubsTimeStamp + 1)
      storage.kaidubsTimeStamp = torrentList[i-1].timestamp;
      reversedList.push(torrentList[i-1]);
    }
  }

  if (reversedList.length === 0){
    console.log('Golumpa up to date')
  } else {
    for(let j = 0; j < reversedList.length; j++){
      let url = reversedList[j].magnet;
      let name = reversedList[j].name;
      addTorrent(url, path, name);
    }
  }
}

exports.kaidubsList = function () {
  kaidubs.Update('kaidubs dragon ball super dual audio 1080', '/media/Anime/AnimeDL[dual]');
  kaidubs.Update('kaidubs Mobile Suit Gundam; The Origin (TV) 1080', '/media/Anime/AnimeDL[dub]');
  kaidubs.Update('kaidubs Boruto Naruto Next Generations 1080', '/media/Anime/AnimeDL[dub]');
  kaidubs.Update('kaidubs Lupin III Part V 1080', '/media/Anime/AnimeDL[dub]');
  kaidubs.Update('kaidubs Attack on Titan S3 1080', '/media/Anime/AnimeDL[dub]');
}