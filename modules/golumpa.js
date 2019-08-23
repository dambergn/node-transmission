'use strict';

const fs = require('fs');
require('dotenv').config();
const { si, pantsu } = require('nyaapi')
const cmd = require('node-cmd');
const sys = require('sys');
const exec = require('child_process').exec;
const storage = require('./storage.js')

// let lastTimeStamp = 0;

exports.Update = function (request, path) {
  si.search(request, 20, {
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
        // console.log('golumpa data:', episode.name)
        // addTorrent(data[i].links.magnet, path, data[i].name)
      }
      // console.log(results)
      // console.log('Results found:', results.length)
      // torrentList = results
      timeStampCheck(results, path)
    }).catch((err) => console.log(err))
}

const username = process.env.TRANS_USER
const password = process.env.TRANS_PASSWORD

function transmissionDownload(url, path) {
  return `transmission-remote -n '${username}:${password}' -w ${path} -a ${url}`
}

function addTorrent(url, path, name) {
  let command = transmissionDownload(url, path)
  console.log('command:', command)
  exec(command, function (err, stdout, stderr) {
    if (err) console.log('err: ', err);
    if (stderr) console.log('stderr: ', stderr);
    console.log('success:', stdout);
    console.log('added: ', name);
  })

  // cmd.get(command, function (err, data, stderr) {
  //   // if(err)console.log('err: ', err);
  //   // if(stderr)console.log('stderr: ', stderr);
  //   console.log('command:', command)
  //   console.log('success:', data);
  //   console.log('added: ', name);
  // });
}

function timeStampCheck(torrentList, path) {
  let reversedList = [];
  // console.log('timeStampTest:', torrentList[0].timestamp);
  for (let i = torrentList.length; i > 0; i--) {
    // console.log('timeStampTest:', torrentList[i-1].timestamp);
    // console.log('storage test', storage.golumpaTimeStamp)
    if (torrentList[i - 1].timestamp >= storage.golumpaTimeStamp + 1) {
      console.log(torrentList[i - 1].timestamp, 'to', storage.golumpaTimeStamp + 1)
      // lastTimeStamp = torrentList[i-1].timestamp;
      storage.golumpaTimeStamp = torrentList[i - 1].timestamp;
      reversedList.push(torrentList[i - 1]);
    }
  }

  if (reversedList.length === 0) {
    console.log('Golumpa up to date')
  } else {
    for (let j = 0; j < reversedList.length; j++) {
      let url = reversedList[j].magnet;
      let name = reversedList[j].name;
      addTorrent(url, path, name);
    }
  }


  // storage.updateLTS()
  // console.log(reversedList);
  // console.log('last: ', torrentList[torrentList.length-1]);
}