#!/bin/bash

echo "Username:"
read username
echo "Password:"
read password

#echo "paste torrent url"
#read torrent
dlPath=/media/downloads

#echo "transmission-remote -n '${username}:${password}' -a $torrent -w $dlPath"

#transmission-remote -n $username:$password -a $torrent -w $dlPath

transmission-remote -n $username:$password -l
