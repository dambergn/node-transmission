'use strict'

const serverVersion = 'v0.3 Beta'
const fs = require('fs');
var nodemon = require('nodemon');
try {
  if (!fs.existsSync('.env')) {
    console.log('***************************************************');
    console.log('***Please run ./setup.sh or configure .env file!***');
    console.log('***************************************************');
    nodemon.emit('quit');
  }
} catch (err) { console.error(err) }
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require("axios");
const { si, pantsu } = require('nyaapi')
const cmd = require('node-cmd');
const readline = require('readline');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors());

function serverIncriment() {
  let nodePackage = JSON.parse(fs.readFileSync('package.json'));
  let formatting = nodePackage.version.split('.');
  formatting[2]++;
  return nodePackage.version
}

app.listen(PORT, () => {
  console.log('Listening on port:', PORT, 'use CTRL+C to close.')
  console.log('Server started:', new Date());
  console.log('Currently running on Version', serverIncriment())
});

// Admin console commands
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  if (input.split(' ')[0] === 'search') {
    nyaaSearch(input.substr(input.indexOf(' ') + 1))
  } else if (input.split(' ')[0] === 'pwd') {
    cmd.get('pwd', function (err, data, stderr) {
      console.log('the current working dir is : ', data)
    });
  } else if (input.split(' ')[0] === 'clear') {
    cmd.run('apt-get update');
  } else if (input.split(' ')[0] === 'ts-list') {
    cmd.get(transmissionList(), function (err, data, stderr) {
      console.log(data)
    });
  } else if (input.split(' ')[0] === 'ts-test') {
    let url = 'http://releases.ubuntu.com/19.04/ubuntu-19.04-desktop-amd64.iso.torrent'
    let path = '/media/downloads';
    cmd.get(transmissionDownload(url, path), function (err, data, stderr) {
      if(err)console.log('err: ', err)
      if(stderr)console.log('stderr: ', stderr)
      console.log('success', data)
    });
  } else if (input.split(' ')[0] === 'horriblesubs') {
    nyaaUpdate('[HorribleSubs] [1080p]', '/media/Anime/AnimeDL[sub]')
  } else {
    console.log(input, 'is not a valid input')
  };
});

// cmd.get(
//   'pwd',
//   function (err, data, stderr) {
//     console.log('the current working dir is : ', data)
//   }
// );

// cmd.run('touch example.created.file');

function nyaaSearch(request) {
  si.search(request, 20, {
    filter: 2,
  })
    .then((data) => {
      // console.log(data[0])
      console.log(data[0].name)
      console.log(data[0].links.magnet)
      console.log(data[0].links.file)
      console.log(data[0].timestamp)
    }).catch((err) => console.log(err))
}

function nyaaUpdate(request, path) {
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
        addTorrent(data[i].links.magnet, path)
      }
      console.log(results)
    }).catch((err) => console.log(err))
}

// nyaaSearch('[HorribleSubs] [1080p]')
// nyaaUpdate('[HorribleSubs] [1080p]', /media/Anime/AnimeDL[sub]);

const username = process.env.TRANS_USER
const password = process.env.TRANS_PASSWORD

function transmissionList() {
  return `transmission-remote -n '${username}:${password}' -l`
}

function transmissionDownload(url, path){
  return `transmission-remote -n '${username}:${password}' -a ${url} -w ${path}`
}

function addTorrent(url, path){
  cmd.get(transmissionDownload(url, path), function (err, data, stderr) {
    if(err)console.log('err: ', err)
    if(stderr)console.log('stderr: ', stderr)
    console.log('success', data)
  });
}