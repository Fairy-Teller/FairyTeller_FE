#!/bin/bash
REPOSITORY=/home/ubuntu/fe

cd $REPOSITORY

sudo pm2 kill

sudo pm2 start node_modules/react-scripts/scripts/start.js

sudo pm2 save