'use strict';

const fs = require('fs');
require('dotenv').config();
const cmd = require('node-cmd');
// const storage = require('./storage.js')

const username = process.env.TRANS_USER
const password = process.env.TRANS_PASSWORD

function getTorrentByID(id){
  // console.log(`sending: transmission-remote -n '${username}:${password}' -t ${id} -i`)
  return `transmission-remote -n '${username}:${password}' -t ${id} -i`
}

function getTorrentList(){
  let results = []
  for(let i = 1; i <= 3; i++){
    cmd.get(getTorrentByID(i), (err, data, stderr) => {
      if(err)console.log('err: ', err);
      if(stderr)console.log('stderr: ', stderr);
      // console.log('success:', data);
      results.push(data)
    });
  }
  console.log(results)
  console.log('length:', results.lenght)
}

getTorrentList();
