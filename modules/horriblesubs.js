'use strict';

const fs = require('fs');
require('dotenv').config();
const { si, pantsu } = require('nyaapi')
const cmd = require('node-cmd');
const storage = require('./storage.js')

// let lastTimeStamp = 0;

exports.Update = function (request, path) {
  si.search(request, 20, {
    filter: 2,
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
        // addTorrent(data[i].links.magnet, path, data[i].name)
      }
      // console.log(results)
      // console.log('update hit')
      // torrentList = results
      timeStampCheck(results, path)
    }).catch((err) => console.log(err))
}

const username = process.env.TRANS_USER
const password = process.env.TRANS_PASSWORD

function transmissionDownload(url, path){
  return `transmission-remote -n '${username}:${password}' -w ${path} -a ${url}`
}

function addTorrent(url, path, name){
  cmd.get(transmissionDownload(url, path), function (err, data, stderr) {
    if(err)console.log('err: ', err);
    if(stderr)console.log('stderr: ', stderr);
    console.log('success:', data);
    console.log('added: ', name);
  });
}

function timeStampCheck(torrentList, path){
  let reversedList = [];
  // console.log('timeStampTest:', torrentList[0].timestamp);
  for(let i = torrentList.length; i > 0 ; i--){
    // console.log('timeStampTest:', torrentList[i-1].timestamp);
    if(torrentList[i-1].timestamp >= storage.horribleSubsTimeStamp + 1){
      console.log(torrentList[i-1].timestamp, 'to' ,storage.horribleSubsTimeStamp + 1)
      // lastTimeStamp = torrentList[i-1].timestamp;
      storage.horribleSubsTimeStamp = torrentList[i-1].timestamp;
      reversedList.push(torrentList[i-1]);
    }
  }

  if (reversedList.length === 0){
    console.log('HorribleSubs up to date')
  } else {
    for(let j = 0; j < reversedList.length; j++){
      let url = reversedList[j].magnet;
      let name = reversedList[j].name;
      addTorrent(url, path, name);
    }
  }
  

  // storage.updateLTS()
  // console.log(reversedList);
  // console.log('last: ', torrentList[torrentList.length-1]);
}