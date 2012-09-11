#!/usr/bin/env bash
#export PATH="/home/node/.nave/installed/0.8.2/bin:$PATH"
export NODE_ENV=production
start-stop-daemon -K \
 -p /var/run/snowshoe.pid \
 -R=TERM/30/KILL/5