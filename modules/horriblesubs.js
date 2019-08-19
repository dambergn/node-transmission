'use strict';

const fs = require('fs');
require('dotenv').config();
const { si, pantsu } = require('nyaapi')

let lastTimeStamp = '';
let torrentList = [];

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
      console.log(results)
      // console.log('update hit')
      // torrentList = results
      // timeStampCheck(results)
    }).catch((err) => console.log(err))
}

function transmissionDownload(url, path){
  return `transmission-remote -n '${username}:${password}' -a ${url} -ph -w ${path}`
}

function addTorrent(url, path, name){
  cmd.get(transmissionDownload(url, path), function (err, data, stderr) {
    if(err)console.log('err: ', err);
    if(stderr)console.log('stderr: ', stderr);
    console.log('success:', data);
    console.log('added: ', name);
  });
}

function timeStampCheck(torrentList){
  for(let i = torrentList.length; i <= 0 ; i++){
    console.log(torrentList[i]);
  }
  console.log('last: ', torrentList[torrentList.length]);
}