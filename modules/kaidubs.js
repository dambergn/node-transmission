'use strict';

const fs = require('fs');
require('dotenv').config();
const { si, pantsu } = require('nyaapi')
const cmd = require('node-cmd');

const storage = require('./storage.js')
const kaidubs = require('./kaidubs.js')

exports.Update = function (request, path, timeStamp) {
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
      // console.log('KaiDubs:', results)
      timeStampCheck(results, path, timeStamp, request) // Enable to download
    }).catch((err) => console.log(err))
}

const username = process.env.TRANS_USER
const password = process.env.TRANS_PASSWORD

function transmissionDownload(url, path){
  return `transmission-remote -n '${username}:${password}' -w ${path} -a ${url}`
}

function addTorrent(url, path, name){
  cmd.get(transmissionDownload(url, path), function (err, data, stderr) {
    // if(err)console.log('err: ', err);
    // if(stderr)console.log('stderr: ', stderr);
    console.log('success:', data);
    console.log('added: ', name);
  });
}

function timeStampCheck(torrentList, path, upTimeStamp, request){
  let reversedList = [];
  let checking = storage.kaidubs[upTimeStamp]
  for(let i = torrentList.length; i > 0 ; i--){
    if(torrentList[i-1].timestamp >= checking + 1){
      console.log(torrentList[i-1].timestamp, 'to', checking + 1)
      checking = torrentList[i-1].timestamp;
      storage.kaidubs[upTimeStamp] = checking
      // console.log('upate', upTimeStamp)
      reversedList.push(torrentList[i-1]);
    }
  }

  if (reversedList.length === 0){
    console.log(request, 'is up to date')
  } else {
    for(let j = 0; j < reversedList.length; j++){
      let url = reversedList[j].magnet;
      let name = reversedList[j].name;
      // console.log('adding:', name)
      addTorrent(url, path, name);
    }
  }
}



exports.kaidubsList = function () {
  kaidubs.Update('kaidubs dragon ball super dual audio 1080', '/media/Anime/AnimeDL[dual]', 'dragonBallSuperTS');
  setTimeout(function(){
    kaidubs.Update('kaidubs Mobile Suit Gundam\; The Origin (TV) 1080', '/media/Anime/AnimeDL[dub]', 'mobileSuitGundamTS');
  }, 3000);
  kaidubs.Update('kaidubs Boruto Naruto Next Generations 1080', '/media/Anime/AnimeDL[dub]', 'borutoTS');
  kaidubs.Update('kaidubs Lupin III Part V 1080', '/media/Anime/AnimeDL[dub]', 'lupin3PVTS');
  kaidubs.Update('kaidubs Attack on Titan S3 1080', '/media/Anime/AnimeDL[dub]', 'attackOnTitanS3TS');
}