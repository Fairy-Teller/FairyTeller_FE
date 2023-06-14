#!/usr/bin/env bash

cd /home/ubuntu/fe

sudo npm install
sudo npm run build
sudo pm2 start npm --name "fairyteller" -- start
sudo pm2 save