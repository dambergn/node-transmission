#!/bin/bash

echo "Username:"
read username
echo "Password:"
read password

echo "paste torrent url"
read torrent
dlPath=/media/Anime/AnimeDL_dub

#echo "transmission-remote -n '${username}:${password}' -a $torrent -w $dlPath"

transmission-remote -n $username:$password -w $dlPath -a $torrent

#transmission-remote -n $username:$password -l
